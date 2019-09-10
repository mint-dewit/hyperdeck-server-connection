import * as util from 'util'

export const CRLF = '\r\n'

export interface IHash<T> {
	[key: string]: T
}

export interface INotififcationConfig {
	transport: boolean
	remote: boolean
	slot: boolean
	configuration: boolean
}

export class TResponse {
	public code: ResponseCode
	public name: string
	public params: IHash<string>

	constructor (code: ResponseCode, name: string, params?: IHash<string>) {
		this.code = code
		this.name = name
		if (params) this.params = params
	}

	public build (): string {
		let data = util.format('%d %s', this.code, this.name)

		if (this.params) {
			data += ':' + CRLF
			for (const key in this.params) {
				if (this.params.hasOwnProperty(key)) {
					data += util.format('%s: %s', key, this.params[key]) + CRLF
				}
			}
		}

		data += CRLF

		return data
	}
}

export interface IDeserializedCommand {
	raw: string
	name: string
	parameters: { [key: string]: string | undefined }
}

export namespace DeserializedCommands {
	export interface IPreviewCommand extends IDeserializedCommand {
		parameters: {
			'disk id'?: string
		}
	}

	export interface IPlayCommand extends IDeserializedCommand {
		parameters: {
			speed?: string
			loop?: string
			'single clip'?: string
		}
	}

	export interface IPlayrangeSetCommand extends IDeserializedCommand {
		parameters: {
			'clip id'?: string
			in?: string
			out?: string
		}
	}

	export interface IRecordCommand extends IDeserializedCommand {
		parameters: {
			name?: string
		}
	}

	export interface IClipsGetCommand extends IDeserializedCommand {
		parameters: {
			'clip id'?: string
			count?: string
		}
	}

	export interface IClipsAddCommand extends IDeserializedCommand {
		parameters: {
			name?: string
		}
	}

	export interface ISlotInfoCommand extends IDeserializedCommand {
		parameters: {
			'slot id'?: string
		}
	}

	export interface ISlotSelectCommand extends IDeserializedCommand {
		parameters: {
			'slot id'?: string
			'video format'?: string
		}
	}

	export interface INotifyCommand extends IDeserializedCommand {
		parameters: {
			remote?: string
			transport?: string
			slot?: string
			configuration?: string
			'dropped frames'?: string
		}
	}

	export interface IJogCommand extends IDeserializedCommand {
		parameters: {
			timecode?: string
		}
	}

	export interface IShuttleCommand extends IDeserializedCommand {
		parameters: {
			speed?: string
		}
	}

	export interface IRemoteCommand extends IDeserializedCommand {
		parameters: {
			remote?: string
		}
	}

	export interface IConfigurationCommand extends IDeserializedCommand {
		parameters: {
			'video input'?: string
			'audio input'?: string
			'file format'?: string
		}
	}

	export interface IFormatCommand extends IDeserializedCommand {
		parameters: {
			prepare?: string
			confirm?: string
		}
	}

	export interface IIdentifyCommand extends IDeserializedCommand {
		parameters: {
			enable?: string
		}
	}

	export interface IWatchdogCommand extends IDeserializedCommand {
		parameters: {
			period?: string
		}
	}
}

export type ResponseCode = ErrorCode | SynchronousCode | AsynchronousCode

export enum ErrorCode {
	SyntaxError = 100,
	UnsupportedParameter = 101,
	InvalidValue = 102,
	Unsupported = 103,
	DiskFull = 104,
	NoDisk = 105,
	DiskError = 106,
	TimelineEmpty = 107,
	InternalError = 108,
	OutOfRange = 109,
	NoInput = 110,
	RemoteControlDisabled = 111,
	ConnectionRejected = 120,
	InvalidState = 150,
	InvalidCodec = 151,
	InvalidFormat = 160,
	InvalidToken = 161,
	FormatNotPrepared = 162
}

export enum SynchronousCode {
	OK = 200,
	SlotInfo = 202,
	DeviceInfo = 204,
	ClipsInfo = 205,
	DiskList = 206,
	TransportInfo = 208,
	Notify = 209,
	Remote = 210,
	Configuration = 211,
	ClipsCount = 214,
	Uptime = 215,
	FormatReady = 216
}

export enum AsynchronousCode {
	ConnectionInfo = 500,
	SlotInfo = 502,
	TransportInfo = 508,
	RemoteInfo = 510,
	ConfigurationInfo = 511,
}

export enum NotifyType {
	Slot,
	Transport,
	Remote,
	Configuration
}

export enum CommandNames {
	DeviceInfoCommand = 'device info',
	DiskListCommand = 'disk list',
	PreviewCommand = 'preview',
	PlayCommand = 'play',
	PlayrangeSetCommand = 'playrange set',
	PlayrangeClearCommand = 'playrange clear',
	RecordCommand = 'record',
	StopCommand = 'stop',
	ClipsCountCommand = 'clips count',
	ClipsGetCommand = 'clips get',
	ClipsAddCommand = 'clips add',
	ClipsClearCommand = 'clips clear',
	TransportInfoCommand = 'transport info',
	SlotInfoCommand = 'slot info',
	SlotSelectCommand = 'slot select',
	NotifyCommand = 'notify',
	JogCommand = 'jog',
	ShuttleCommand = 'shuttle',
	RemoteCommand = 'remote',
	ConfigurationCommand = 'configuration',
	UptimeCommand = 'uptime',
	FormatCommand = 'format',
	IdentifyCommand = 'identify',
	WatchdogCommand = 'watchdog',
	PingCommand = 'ping'
}

export const ParameterMap = {
	help: [],
	commands: [],
	'device info': [],
	'disk list': [
		'slot id'
	],
	quit: [],
	ping: [],
	preview: [
		'enable'
	],
	play: [
		'speed',
		'loop',
		'single clip'
	],
	'playrange set': [
		'clip id',
		'in',
		'out'
	],
	'playrange clear': [],
	record: [
		'name'
	],
	'stop': [],
	'clips count': [],
	'clips get': [
		'clip id',
		'count'
	],
	'clips add': [
		'name'
	],
	'clips clear': [],
	'transport info': [],
	'slot info': [
		'slot id'
	],
	'slot select': [
		'slot id',
		'video format'
	],
	notify: [
		'remote',
		'transport',
		'slot',
		'configuration',
		'dropped frames'
	],
	goto: [
		'clip id',
		'clip',
		'timeline',
		'timecode',
		'slot id'
	],
	jog: [
		'timecode'
	],
	shuttle: [
		'speed'
	],
	remote: [
		'enable',
		'override'
	],
	configuration: [
		'video input',
		'audio input',
		'file format'
	],
	uptime: [],
	format: [
		'prepare',
		'confirm'
	],
	identify: [
		'enable'
	],
	watchdog: [
		'period'
	]
}

export type IResponse = IHash<string> |
	ResponseInterface.IDeviceInfo |
	ResponseInterface.IDiskList |
	ResponseInterface.IClipsCount |
	ResponseInterface.IClipsGet |
	ResponseInterface.ITransportInfo |
	ResponseInterface.ISlotInfo |
	ResponseInterface.IConfiguration |
	ResponseInterface.IUptime |
	ResponseInterface.IFormat

export namespace ResponseInterface {
	export interface IDeviceInfo {
		'protocol version': string
		model: string
		'slot count': string
	}

	export interface IDiskList extends IHash<string> {
		'slot id': string
	}

	export interface IClipsCount {
		'clip count': string
	}

	export interface IClipsGet extends IHash<string> {
		'clip count': string
	}

	export interface ITransportInfo {
		status: TransportStatus
		speed: string
		'slot id': string
		'clip id': string
		'single clip': string
		'display timecode': string
		'timecode': string
		'video format': VideoFormat
		loop: 'string'
	}

	export interface ISlotInfo {
		'slot id': string
		status: SlotStatus
		'volume name': string
		'recording time': string
		'video format': VideoFormat
	}

	export interface IConfiguration {
		'audio input': AudioInputs
		'video input': VideoInputs
		'file format': FileFormats
	}

	export interface IUptime {
		'uptime': string // @todo: is broken in hyperdeck
	}

	export interface IFormat {
		'token': string // @todo: is broken in hyperdeck
	}
}

export enum SlotStatus {
	EMPTY = 'empty',
	MOUNTING = 'mounting',
	ERROR = 'error',
	MOUNTED = 'mounted'
}

export enum VideoFormat {
	NTSC = 'NTSC',
	PAL = 'PAL',
	NTSCp = 'NTSCp',
	PALp = 'PALp',
	_720p50 = '720p50',
	_720p5994 = '720p5994',
	_720p60 = '720p60',
	_1080p23976 = '1080p23976',
	_1080p24 = '1080p24',
	_1080p25 = '1080p25',
	_1080p2997 = '1080p2997',
	_1080p30 = '1080p30',
	_1080i50 = '1080i50',
	_1080i5994 = '1080i5994',
	_1080i60 = '1080i60',
	_4Kp23976 = '4Kp23976',
	_4Kp24 = '4Kp24',
	_4Kp25 = '4Kp25',
	_4Kp2997 = '4Kp2997',
	_4Kp30 = '4Kp30',
	_4Kp50 = '4Kp50',
	_4Kp5994 = '4Kp5994',
	_4Kp60 = '4Kp60'
}

export enum TransportStatus {
	PREVIEW = 'preview',
	STOPPED = 'stopped',
	PLAY = 'play',
	FORWARD = 'forward',
	REWIND = 'rewind',
	JOG = 'jog',
	SHUTTLE = 'shuttle',
	RECORD = 'record'
}

export enum FileFormats {
	QuickTimeUncompressed = 'QuickTimeUncompressed',
	QuickTimeProResHQ = 'QuickTimeProResHQ',
	QuickTimeProRes = 'QuickTimeProRes',
	QuickTimeProResLT = 'QuickTimeProResLT',
	QuickTimeProResProxy = 'QuickTimeProResProxy',
	QuickTimeDNxHR220 = 'QuickTimeDNxHR220',
	DNxHR220 = 'DNxHR220'
}

export enum AudioInputs {
	embedded = 'embedded',
	XLR = 'XLR',
	RCA = 'RCA'
}

export enum VideoInputs {
	SDI = 'SDI',
	HDMI = 'HDMI',
	component = 'component'
}
