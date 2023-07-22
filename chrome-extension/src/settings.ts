// all settings logic 
import { CN_SetCookie, CN_GetCookie } from './cookie-utils';

// Save settings and close dialog box
export function CN_SaveSettings() {
	
	// Save settings
	try {
		// AI voice settings: voice/language, rate, pitch
		var wantedVoiceIndex = jQuery("#TTGPTVoice").val();
		var allVoices = speechSynthesis.getVoices();
		CN_WANTED_VOICE = allVoices[wantedVoiceIndex];
		CN_WANTED_VOICE_NAME = CN_WANTED_VOICE ? CN_WANTED_VOICE.lang+"-"+CN_WANTED_VOICE.name : "";
		CN_TEXT_TO_SPEECH_RATE = Number( jQuery("#TTGPTRate").val() );
		CN_TEXT_TO_SPEECH_PITCH = Number( jQuery("#TTGPTPitch").val() );
		
		// Speech recognition settings: language, stop, pause
		CN_WANTED_LANGUAGE_SPEECH_REC = jQuery("#TTGPTRecLang").val();
		CN_SAY_THIS_WORD_TO_STOP = CN_RemovePunctuation( jQuery("#TTGPTStopWord").val() );
		CN_SAY_THIS_WORD_TO_PAUSE = CN_RemovePunctuation( jQuery("#TTGPTPauseWord").val() );
		CN_KEEP_LISTENING = jQuery("#TTGPTKeepListening").prop("checked");
		CN_AUTO_SEND_AFTER_SPEAKING = jQuery("#TTGPTAutosend").prop("checked");
		CN_SAY_THIS_TO_SEND = CN_RemovePunctuation( jQuery("#TTGPTSendWord").val() );
		CN_IGNORE_COMMAS = jQuery("#TTGPTIgnoreCommas").prop("checked");
		CN_IGNORE_CODE_BLOCKS = jQuery("#TTGPTIgnoreCode").prop("checked");
		
		// ElevenLabs
		CN_TTS_ELEVENLABS = jQuery("#TTGPTElevenLabs").prop("checked");
		CN_TTS_ELEVENLABS_APIKEY = CN_RemovePunctuation(jQuery("#TTGPTElevenLabsKey").val()+"");
		CN_TTS_ELEVENLABS_VOICE = jQuery("#TTGPTElevenLabsVoice").val()+"";
		CN_TTS_ELEVENLABS_STABILITY = jQuery("#TTGPTElevenLabsStability").val();
		CN_TTS_ELEVENLABS_SIMILARITY = jQuery("#TTGPTElevenLabsSimilarity").val();
		
		// If ElevenLabs is active, and that there is no voice, error out
		if (CN_TTS_ELEVENLABS && !CN_TTS_ELEVENLABS_VOICE) {
			alert("To enable ElevenLabs support, you must select a voice in the dropdown list. Click the Refresh List button. If no voice appears in the list, check your API key. If you are 100% sure your API key is valid, please report the issue on the Github project page, on the Issues tab.");
			return;
		}
		
		// Apply language to speech recognition instance
		if (CN_SPEECHREC) CN_SPEECHREC.lang = CN_WANTED_LANGUAGE_SPEECH_REC;
		
		// Save settings in cookie
		var settings = [
			CN_WANTED_VOICE_NAME,
			CN_TEXT_TO_SPEECH_RATE,
			CN_TEXT_TO_SPEECH_PITCH,
			CN_WANTED_LANGUAGE_SPEECH_REC,
			CN_SAY_THIS_WORD_TO_STOP,
			CN_SAY_THIS_WORD_TO_PAUSE,
			CN_AUTO_SEND_AFTER_SPEAKING?1:0,
			CN_SAY_THIS_TO_SEND,
			CN_IGNORE_COMMAS?1:0,
			CN_KEEP_LISTENING?1:0,
			CN_IGNORE_CODE_BLOCKS?1:0,
			CN_TTS_ELEVENLABS?1:0,
			CN_TTS_ELEVENLABS_APIKEY,
			CN_TTS_ELEVENLABS_VOICE,
			CN_TTS_ELEVENLABS_STABILITY,
			CN_TTS_ELEVENLABS_SIMILARITY
		];
		CN_SetCookie("CN_TTGPT", JSON.stringify(settings));
	} catch(e) { alert('Invalid settings values. '+e.toString()); return; }
	
	// Close dialog
	console.log("Closing settings dialog");
	jQuery("#TTGPTSettingsArea").remove();
	
	// Resume listening
	CN_PAUSED = false;
}

// Restore settings from cookie
export function CN_RestoreSettings() {
	var settingsRaw = CN_GetCookie("CN_TTGPT");
	try {
		var settings = JSON.parse(settingsRaw);
		if (typeof settings == "object" && settings != null) {
			console.log("Reloading settings from cookie: "+settings);
			CN_WANTED_VOICE_NAME = settings[0];
			CN_TEXT_TO_SPEECH_RATE = settings[1];
			CN_TEXT_TO_SPEECH_PITCH = settings[2];
			CN_WANTED_LANGUAGE_SPEECH_REC = settings[3];
			CN_SAY_THIS_WORD_TO_STOP = settings[4];
			CN_SAY_THIS_WORD_TO_PAUSE = settings[5];
			if (settings.hasOwnProperty(6)) CN_AUTO_SEND_AFTER_SPEAKING = settings[6] == 1;
			if (settings.hasOwnProperty(7)) CN_SAY_THIS_TO_SEND = settings[7];
			if (settings.hasOwnProperty(8)) CN_IGNORE_COMMAS = settings[8] == 1;
			if (settings.hasOwnProperty(9)) CN_KEEP_LISTENING = settings[9] == 1;
			if (settings.hasOwnProperty(10)) CN_IGNORE_CODE_BLOCKS = settings[10] == 1;
			if (settings.hasOwnProperty(11)) CN_TTS_ELEVENLABS = settings[11] == 1;
			if (settings.hasOwnProperty(12)) CN_TTS_ELEVENLABS_APIKEY = settings[12];
			if (settings.hasOwnProperty(13)) CN_TTS_ELEVENLABS_VOICE = settings[13];
			if (settings.hasOwnProperty(14)) CN_TTS_ELEVENLABS_STABILITY = settings[14];
			if (settings.hasOwnProperty(15)) CN_TTS_ELEVENLABS_SIMILARITY = settings[15];
		}
	} catch (ex) {
		console.error(ex);
	}
}