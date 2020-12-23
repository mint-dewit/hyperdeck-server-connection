import { Hash } from '../types'
import {
	TransportStatus,
	VideoFormat,
	SlotStatus,
	AudioInputs,
	VideoInputs,
	FileFormats
} from '../types'

export interface DeviceInfo {
	'protocol version': string
	model: string
	'slot count': string
}

export interface DiskList extends Hash<string> {
	'slot id': string
}

export interface ClipsCount {
	'clip count': string
}

export interface ClipsGet extends Hash<string> {
	'clip count': string
}

export interface TransportInfo {
	status: TransportStatus
	speed: string
	'slot id': string
	'clip id': string
	'single clip': string
	'display timecode': string
	timecode: string
	'video format': VideoFormat
	loop: 'string'
}

export interface SlotInfo {
	'slot id': string
	status: SlotStatus
	'volume name': string
	'recording time': string
	'video format': VideoFormat
}

export interface Configuration {
	'audio input': AudioInputs
	'video input': VideoInputs
	'file format': FileFormats
}

export interface RemoteOptions {
	enabled: boolean
	override: boolean
}

export interface Uptime {
	uptime: string // @todo: is broken in hyperdeck
}

export interface Format {
	token: string // @todo: is broken in hyperdeck
}
