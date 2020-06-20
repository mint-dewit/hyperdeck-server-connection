import { HyperdeckSocket } from './socket'
import {
	DeserializedCommand,
	DeserializedCommands,
	Hash,
	TResponse,
	SynchronousCode,
	CommandNames,
	ErrorCode,
	NotifyType,
	ResponseInterface
} from './types'
import { createServer, Server } from 'net'

export class HyperdeckServer {
	private _sockets: { [id: string]: HyperdeckSocket } = {}
	private _server: Server

	onDeviceInfo: (command: DeserializedCommand) => Promise<ResponseInterface.DeviceInfo>
	onDiskList: (command: DeserializedCommand) => Promise<ResponseInterface.DiskList>
	onPreview: (command: DeserializedCommands.PreviewCommand) => Promise<void>
	onPlay: (command: DeserializedCommands.PlayCommand) => Promise<void>
	onPlayrangeSet: (command: DeserializedCommands.PlayrangeSetCommand) => Promise<void>
	onPlayrangeClear: (command: DeserializedCommand) => Promise<void>
	onRecord: (command: DeserializedCommands.RecordCommand) => Promise<void>
	onStop: (command: DeserializedCommand) => Promise<void>
	onClipsCount: (command: DeserializedCommand) => Promise<ResponseInterface.ClipsCount>
	onClipsGet: (
		command: DeserializedCommands.ClipsGetCommand
	) => Promise<ResponseInterface.ClipsGet>
	onClipsAdd: (command: DeserializedCommands.ClipsAddCommand) => Promise<void>
	onClipsClear: (command: DeserializedCommand) => Promise<void>
	onTransportInfo: (command: DeserializedCommand) => Promise<ResponseInterface.TransportInfo>
	onSlotInfo: (
		command: DeserializedCommands.SlotInfoCommand
	) => Promise<ResponseInterface.SlotInfo>
	onSlotSelect: (command: DeserializedCommands.SlotSelectCommand) => Promise<void>
	onGoTo: (command: DeserializedCommands.GoToCommand) => Promise<void>
	onJog: (command: DeserializedCommands.JogCommand) => Promise<void>
	onShuttle: (command: DeserializedCommands.ShuttleCommand) => Promise<void>
	onRemote: (command: DeserializedCommands.RemoteCommand) => Promise<void>
	onConfiguration: (
		command: DeserializedCommands.ConfigurationCommand
	) => Promise<ResponseInterface.Configuration>
	onUptime: (command: DeserializedCommand) => Promise<ResponseInterface.Uptime>
	onFormat: (command: DeserializedCommands.FormatCommand) => Promise<ResponseInterface.Format>
	onIdentify: (command: DeserializedCommands.IdentifyCommand) => Promise<void>
	onWatchdog: (command: DeserializedCommands.WatchdogCommand) => Promise<void>

	constructor(ip?: string) {
		this._server = createServer((socket) => {
			const socketId = Math.random().toString(35).substr(-6)
			this._sockets[socketId] = new HyperdeckSocket(socket, (cmd) =>
				this._receivedCommand(cmd)
			)
			this._sockets[socketId].on('disconnected', () => {
				delete this._sockets[socketId]
			})
		})
		this._server.on('listening', () => console.log('listening'))
		this._server.maxConnections = 1
		this._server.listen(9993, ip)
	}

	close(): void {
		this._server.unref()
	}

	notifySlot(params: Hash<string>): void {
		this._notify(NotifyType.Slot, params)
	}

	notifyTransport(params: Hash<string>): void {
		this._notify(NotifyType.Transport, params)
	}

	private _notify(type: NotifyType, params: Hash<string>): void {
		for (const id of Object.keys(this._sockets)) {
			this._sockets[id].notify(type, params)
		}
	}

	private async _receivedCommand(cmd: DeserializedCommand): Promise<TResponse> {
		const intErrorCatch = (err?: { code: number; msg: string }): TResponse => {
			if (err) return new TResponse(err.code, err.msg)
			else return new TResponse(ErrorCode.InternalError, 'internal error')
		}
		let executor:
			| ((command: DeserializedCommand) => Promise<typeof ResponseInterface | void>)
			| undefined
		let resHandler: ((res?: Hash<string>) => TResponse) | undefined

		if (cmd.name === CommandNames.DeviceInfoCommand) {
			executor = this.onDeviceInfo
			resHandler = (res) => new TResponse(SynchronousCode.DeviceInfo, 'device info', res)
		} else if (cmd.name === CommandNames.DiskListCommand) {
			executor = this.onDiskList
			resHandler = (res) => new TResponse(SynchronousCode.DiskList, 'disk list', res)
		} else if (cmd.name === CommandNames.PreviewCommand) {
			executor = this.onPreview
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.PlayCommand) {
			executor = this.onPlay
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.PlayrangeSetCommand) {
			executor = this.onPlayrangeSet
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.PlayrangeClearCommand) {
			executor = this.onPlayrangeClear
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.RecordCommand) {
			executor = this.onRecord
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.StopCommand) {
			executor = this.onStop
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.ClipsCountCommand) {
			executor = this.onClipsCount
			resHandler = (res) => new TResponse(SynchronousCode.ClipsCount, 'clips count', res)
		} else if (cmd.name === CommandNames.ClipsGetCommand) {
			executor = this.onClipsGet
			resHandler = (res) => new TResponse(SynchronousCode.ClipsInfo, 'clips info', res)
		} else if (cmd.name === CommandNames.ClipsAddCommand) {
			executor = this.onClipsAdd
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.ClipsClearCommand) {
			executor = this.onClipsClear
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.TransportInfoCommand) {
			executor = this.onTransportInfo
			resHandler = (res) =>
				new TResponse(SynchronousCode.TransportInfo, 'transport info', res)
		} else if (cmd.name === CommandNames.SlotInfoCommand) {
			executor = this.onSlotInfo
			resHandler = (res) => new TResponse(SynchronousCode.SlotInfo, 'slot info', res)
		} else if (cmd.name === CommandNames.SlotSelectCommand) {
			executor = this.onSlotSelect
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.NotifyCommand) {
			// implemented in socket.ts
			return new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.GoToCommand) {
			executor = this.onGoTo
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.JogCommand) {
			executor = this.onJog
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.ShuttleCommand) {
			executor = this.onShuttle
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.RemoteCommand) {
			executor = this.onRemote
			resHandler = (res?) => {
				if (!res) return new TResponse(SynchronousCode.OK, 'ok')
				else return new TResponse(SynchronousCode.Remote, 'remote', res)
			}
		} else if (cmd.name === CommandNames.ConfigurationCommand) {
			executor = this.onConfiguration
			resHandler = (res) => {
				if (res) return new TResponse(SynchronousCode.Configuration, 'configuration', res)
				else return new TResponse(SynchronousCode.OK, 'ok')
			}
		} else if (cmd.name === CommandNames.UptimeCommand) {
			executor = this.onUptime
			resHandler = (res) => new TResponse(SynchronousCode.Uptime, 'uptime', res)
		} else if (cmd.name === CommandNames.FormatCommand) {
			executor = this.onFormat
			resHandler = (res?) => {
				if (res) return new TResponse(SynchronousCode.FormatReady, 'format ready', res)
				else return new TResponse(SynchronousCode.OK, 'ok')
			}
		} else if (cmd.name === CommandNames.IdentifyCommand) {
			executor = this.onIdentify
			resHandler = () => new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.WatchdogCommand) {
			// implemented in socket.ts
			return new TResponse(SynchronousCode.OK, 'ok')
		} else if (cmd.name === CommandNames.PingCommand) {
			// implemented in socket.ts
			return new TResponse(SynchronousCode.OK, 'ok')
		}

		if (executor && resHandler) {
			return executor(cmd).then(resHandler, intErrorCatch)
		}

		return Promise.reject()
	}
}
