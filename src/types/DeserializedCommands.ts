import { DeserializedCommand } from '../types'

export interface PreviewCommand extends DeserializedCommand {
	parameters: {
		'disk id'?: string
	}
}

export interface PlayCommand extends DeserializedCommand {
	parameters: {
		speed?: string
		loop?: string
		'single clip'?: string
	}
}

export interface PlayrangeSetCommand extends DeserializedCommand {
	parameters: {
		'clip id'?: string
		in?: string
		out?: string
	}
}

export interface RecordCommand extends DeserializedCommand {
	parameters: {
		name?: string
	}
}

export interface ClipsGetCommand extends DeserializedCommand {
	parameters: {
		'clip id'?: string
		count?: string
	}
}

export interface ClipsAddCommand extends DeserializedCommand {
	parameters: {
		name?: string
	}
}

export interface SlotInfoCommand extends DeserializedCommand {
	parameters: {
		'slot id'?: string
	}
}

export interface SlotSelectCommand extends DeserializedCommand {
	parameters: {
		'slot id'?: string
		'video format'?: string
	}
}

export interface NotifyCommand extends DeserializedCommand {
	parameters: {
		remote?: string
		transport?: string
		slot?: string
		configuration?: string
		'dropped frames'?: string
	}
}

export interface JogCommand extends DeserializedCommand {
	parameters: {
		timecode?: string
	}
}

export interface ShuttleCommand extends DeserializedCommand {
	parameters: {
		speed?: string
	}
}

export interface RemoteCommand extends DeserializedCommand {
	parameters: {
		remote?: string
	}
}

export interface ConfigurationCommand extends DeserializedCommand {
	parameters: {
		'video input'?: string
		'audio input'?: string
		'file format'?: string
	}
}

export interface FormatCommand extends DeserializedCommand {
	parameters: {
		prepare?: string
		confirm?: string
	}
}

export interface IdentifyCommand extends DeserializedCommand {
	parameters: {
		enable?: string
	}
}

export interface WatchdogCommand extends DeserializedCommand {
	parameters: {
		period?: string
	}
}
