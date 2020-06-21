import { Socket } from 'net'
import { EventEmitter } from 'events'
import {
	TResponse,
	AsynchronousCode,
	DeserializedCommand,
	ErrorCode,
	CommandNames,
	DeserializedCommands,
	NotifyType,
	Hash,
	SynchronousCode
} from './types'
import { MultilineParser } from './parser'

export class HyperdeckSocket extends EventEmitter {
	private _socket: Socket
	private _parser: MultilineParser
	private _receivedCommand: (cmd: DeserializedCommand) => Promise<TResponse>
	private _lastReceived: number
	private _watchdogTimer: NodeJS.Timer

	private _notifySettings = {
		slot: false,
		transport: false,
		remote: false,
		configuration: false,
		'dropped frames': false // @todo: implement
	}

	constructor(socket: Socket, receivedCommand: (cmd: DeserializedCommand) => Promise<TResponse>) {
		super()

		this._parser = new MultilineParser(false, () => null)
		this._receivedCommand = receivedCommand

		this._socket = socket
		this._socket.setEncoding('utf-8')
		this._socket.on('data', (data: string) => this._onMessage(data))
		this._socket.on('error', () => {
			this._socket.destroy()
			this.emit('disconnected')
		})

		this.sendResponse(
			new TResponse(AsynchronousCode.ConnectionInfo, 'connection info', {
				'protocol version': '1.6',
				model: 'NodeJS Hyperdeck Server Library'
			})
		)
	}

	private _onMessage(data: string): void {
		this._lastReceived = Date.now()

		const cmds = this._parser.receivedString(data)

		for (const cmd of cmds) {
			// special cases
			if (cmd.name === CommandNames.WatchdogCommand) {
				if (this._watchdogTimer) clearInterval(this._watchdogTimer)

				const watchdogCmd = cmd as DeserializedCommands.WatchdogCommand
				if (watchdogCmd.parameters.period) {
					this._watchdogTimer = setInterval(() => {
						if (
							Date.now() - this._lastReceived >
							Number(watchdogCmd.parameters.period)
						) {
							this._socket.destroy()
							this.emit('disconnected')
							clearInterval(this._watchdogTimer)
						}
					}, Number(watchdogCmd.parameters.period) * 1000)
				}
			} else if (cmd.name === CommandNames.NotifyCommand) {
				const notifyCmd = cmd as DeserializedCommands.NotifyCommand

				if (Object.keys(notifyCmd.parameters).length > 0) {
					for (const param of Object.keys(notifyCmd.parameters) as Array<
						keyof typeof notifyCmd.parameters
					>) {
						if (this._notifySettings[param] !== undefined) {
							this._notifySettings[param] = notifyCmd.parameters[param] === 'true'
						}
					}
				} else {
					const settings: Hash<string> = {}
					for (const key of Object.keys(this._notifySettings) as Array<
						keyof HyperdeckSocket['_notifySettings']
					>) {
						settings[key] = this._notifySettings[key] ? 'true' : 'false'
					}
					this.sendResponse(new TResponse(SynchronousCode.Notify, 'notify', settings))

					continue
				}
			}

			this._receivedCommand(cmd).then(
				(res) => {
					this.sendResponse(res)
				},
				() => {
					// not implemented by client code:
					this.sendResponse(new TResponse(ErrorCode.Unsupported, 'unsupported'))
				}
			)
		}
	}

	sendResponse(res: TResponse): void {
		const msg = res.build()
		this._socket.write(msg)
	}

	notify(type: NotifyType, params: Hash<string>): void {
		if (type === NotifyType.Configuration && this._notifySettings.configuration) {
			this.sendResponse(
				new TResponse(AsynchronousCode.ConfigurationInfo, 'configuration info', params)
			)
		} else if (type === NotifyType.Remote && this._notifySettings.remote) {
			this.sendResponse(new TResponse(AsynchronousCode.RemoteInfo, 'remote info', params))
		} else if (type === NotifyType.Slot && this._notifySettings.slot) {
			this.sendResponse(new TResponse(AsynchronousCode.SlotInfo, 'slot info', params))
		} else if (type === NotifyType.Transport && this._notifySettings.transport) {
			this.sendResponse(
				new TResponse(AsynchronousCode.TransportInfo, 'transport info', params)
			)
		}
	}
}
