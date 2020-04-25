export default `
<!--
"Hanping Chinese Templates for Anki" by EmberMitre is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.

Hanping Chinese Dictionary on Google Play: https://play.google.com/store/apps/details?id=com.embermitre.hanping.app.pro
-->
<a class=hanzi 
  href='intent:#Intent;action=com.hanpingchinese.cmn.intent.action.DETAILS;package=com.embermitre.hanping.app.pro;S.p={{text:pinyin}};S.s={{text:simplified}};S.t={{text:simplified}};S.LANG=cmn;S._SOURCE=anki;end'
  >{{simplified}}</a>
<br><br>
{{#pinyin}}
<a class=phonetic 
href='intent:#Intent;action=com.hanpingchinese.cmn.intent.action.PLAY;package=com.embermitre.hanping.app.pro;S.p={{text:pinyin}};S.s={{text:simplified}};S.t={{text:simplified}};S.LANG=cmn;S._SOURCE=anki;end'>{{pinyin}}</a>{{/pinyin}}<br><br>
<span class=meaning>{{meaning}}</span>
<br><br>
<a class=links_button 
href='intent:#Intent;action=com.hanpingchinese.cmn.intent.action.LINKS;package=com.embermitre.hanping.app.pro;S.p={{text:pinyin}};S.s={{text:simplified}};S.t={{text:simplified}};S.LANG=cmn;S._SOURCE=anki;end'
>links</a>
<script>
function readHanziTypePref(langCode) {
	var defaultValue = langCode == 'yue' ? 'trad' : 'simp_trad';
	return readPref(langCode, 'hanzi_type', defaultValue);
}

function readPhoneticTypePref(langCode) {
	var defaultValue = langCode == 'yue' ? 'jyutping_superscript' : 'pinyin_marked';
	return readPref(langCode, 'phonetic_type', defaultValue);
}

function readColoringStrategyPref(langCode) {
	return readPref(langCode, 'coloring_strategy', 'hanzi');
}

function readPref(langCode, prefNameWithoutLangCode, defaultValue) {
	var prefix = '.' + langCode + '_' + prefNameWithoutLangCode + '.';
	for (var i = 0; i < document.styleSheets.length; i++) {
		var ss = document.styleSheets[i];
		if (!ss) {
			continue;
		}
		try {
			var classes = ss.rules || ss.cssRules;
			if (!classes) {
				continue;
			}
			for (var x = 0; x < classes.length; x++) {
				var cls = classes[x];
				if (cls && cls.selectorText && cls.selectorText.indexOf(prefix) == 0) {
					var result = cls.selectorText.substr(prefix.length);
					console.log(prefNameWithoutLangCode + "=" + result);
					return result;
				}
			}
		} catch (err) {
			console.log("caught: " + err.name + ": " + err.message);
			continue;
		}
	}
	return defaultValue;
}

function toHanzi(langCode, trad, simp, hideTones) {
	trad = normalizeHanzi(trad);
	simp = normalizeHanzi(simp);
	if (!trad && !simp) {
		return null;
	}
	var hanziType = readHanziTypePref(langCode);
	var coloringStrategy = readColoringStrategyPref(langCode);
	var coloringEnabled = !hideTones && coloringStrategy == 'hanzi';
	var preferTrad = hanziType.indexOf('trad') == 0; // startsWith() doesn't work :(
	var primaryHanzi = preferTrad ? trad : simp;
	var secondaryHanzi = preferTrad ? simp : trad;
	var showBoth = hanziType.indexOf('_') >= 0;
	var result;
	if (!primaryHanzi) {
		result = '[' + secondaryHanzi + ']';
	}
	else if (!secondaryHanzi || !showBoth || primaryHanzi.replace(/<.+?>/g,'') == secondaryHanzi.replace(/<.+?>/g,'')) {
		result = primaryHanzi;
	}
	else {
		var spanPatt = /(<span class="?(?:[a-z]{3}_)?tone\\d"?>)(.+?)(<\\/span>)/;
		var remainingPrimary = primaryHanzi;
		var remainingSecondary = secondaryHanzi;
		var maskedSecondary = '';
		while (remainingPrimary != '' && remainingSecondary != '') {
			var primaryMatch = spanPatt.exec(remainingPrimary);
			if (!primaryMatch) {
				break;
			}
			var secondaryMatch = spanPatt.exec(remainingSecondary);
			if (!secondaryMatch) {
				break;
			}
			maskedSecondary += remainingSecondary.substring(0, secondaryMatch.index);
			if (primaryMatch[2] == secondaryMatch[2]) { // sufficient to ignore spans when comparing
				maskedSecondary += secondaryMatch[1] + '-' + secondaryMatch[3];
			}
			else {
				maskedSecondary += secondaryMatch[0];
			}
			remainingPrimary = remainingPrimary.substr(primaryMatch.index + primaryMatch[0].length)
			remainingSecondary = remainingSecondary.substr(secondaryMatch.index + secondaryMatch[0].length)
		}
		maskedSecondary += remainingSecondary;
		if (primaryHanzi == maskedSecondary || maskedSecondary == '') {
			result = primaryHanzi;
		}
		else {
			result = primaryHanzi + ' [' + maskedSecondary + ']';
		}
	}
	if (!coloringEnabled) {
		return result.replace(/<span class="?(?:[a-z]{3}_)?tone\\d"?>(.+?)<\\/span>/g, '$1');
	}
	return result;
}

function normalizeHanzi(hanzi) {
	if (!hanzi) {
		return '';
	}
	if (hanzi.charAt(0) == '[' && hanzi.charAt(hanzi.length - 1) == ']') {
		return '';
	}
	return decodeURIComponent(hanzi);
}

function toPhonetic(langCode, pinyinNumbered, hideTones) {
	if (!pinyinNumbered) {
		return '';
	}
	pinyinNumbered = decodeURIComponent(pinyinNumbered);
	var supportedLangCode = 'cmn';
	if (!langCode && langCode != supportedLangCode) {
		throw 'Unexpected lang code: ' + langCode;
	}
	var phoneticType = readPhoneticTypePref(supportedLangCode);
	var coloringEnabled = readColoringStrategyPref(supportedLangCode) == 'phonetic';
	if (phoneticType == 'none') {
		return '<div class=play_button><div class=play_icon></div></div>';
	}
	var toneStyle; // 0=numbers, 1=marks, other=hidden
	if (hideTones) {
		toneStyle = -1;
	}
	else {
		toneStyle = phoneticType.indexOf('marked') >= 0 ? 1 : 0;
	}
	var showColoring = toneStyle >= 0 && coloringEnabled;
	var remainingText = pinyinNumbered;
	var result = '';
	var patt = /\\b([a-z]{1,6})([1-5])\\b/i;
	var match;
	while (match = patt.exec(remainingText)) {
		var tonelessSyllable = match[1];
		var toneNum = match[2];
		var newSyllable = toPinyinSyllable(tonelessSyllable, toneNum, toneStyle);
		result += remainingText.substring(0, match.index);
		if (!newSyllable) {
			result += match[1] + match[2];
		}
		else {
			if (showColoring) {
				result += '<span class=' + supportedLangCode + '_tone' + match[2] + '>' + newSyllable + '</span>';
			}
			else {
				result += newSyllable;
			}
		}
		remainingText = remainingText.substr(match.index + match[0].length);
	}
	return result + remainingText;
}

function toPinyinSyllable(tonelessSyllable, toneNum, toneStyle) {
	switch (toneStyle) {
	case 0:
		return tonelessSyllable + toneNum;
	case 1:
		return toMarkedPinyinSyllable(tonelessSyllable, toneNum);
	default:
		return tonelessSyllable;
	}
}

var toneCharMap = {};
toneCharMap['a']='āáǎà';
toneCharMap['e']='ēéěè';
toneCharMap['i']='īíǐì';
toneCharMap['o']='ōóǒò';
toneCharMap['u']='ūúǔù';
toneCharMap['ü']='ǖǘǚǜ';
toneCharMap['m']=' ḿ  ';
toneCharMap['n']=' ńňǹ';

function toMarkedPinyinSyllable(tonelessPinyin, toneNum) {
	if (toneNum < 1 || toneNum > 5 || tonelessPinyin.length < 1) {
		return tonelessPinyin + toneNum; // not real pinyin
	}
	tonelessPinyin = tonelessPinyin.replace('v', 'ü');
	if (toneNum == 5) {
		return tonelessPinyin;
	}
	var charToReplace;
	var vowels = tonelessPinyin.replace(/[^aeiouü]/g, '');
	switch (vowels.length) {
		case 0:
			charToReplace = tonelessPinyin.charAt(0);
			break;
		case 1:
			charToReplace = vowels.charAt(0);
			break;
		default:
			if (vowels.indexOf("a") >= 0) {
				charToReplace = 'a';
			}
			else if (vowels.indexOf("e") >= 0) {
				charToReplace = 'e';
			}
			else if (vowels.indexOf("ou") >= 0) {
				charToReplace = 'o';
			}
			else {
				charToReplace = vowels.charAt(1);
			}
	}
	var tonesStr = toneCharMap[charToReplace];
	var replacementChar = tonesStr == null ? null : tonesStr.charAt(toneNum - 1);
	if (replacementChar == null || replacementChar == ' ') {
		return tonelessPinyin + toneNum;
	}
	else {
		return tonelessPinyin.replace(charToReplace, replacementChar);
	}
}


function toMeaning(langCode, rawMeaning, hideTones) {
	var patt = /<span class=chinese_word>(.*?)\\|(.*?)\\|(.*?)<\\/span>/i;
	var result = '';
	var remainingText = rawMeaning;
	var match;
	while (match = patt.exec(remainingText)) {
		var trad = decodeURIComponent(match[1]);
		var simp = decodeURIComponent(match[2]);
		var rawPhonetic = decodeURIComponent(match[3]);
		result += remainingText.substring(0, match.index);
		result += toHanzi(langCode, trad, simp, true);
		var phonetic = toPhonetic(langCode, rawPhonetic, hideTones);
		if (phonetic) {
			result += ' (' + phonetic + ')';
		}
		remainingText = remainingText.substr(match.index + match[0].length);
	};
	result += remainingText;
	result = result.replace(/<.+?>/g, '');
	result = decodeURIComponent(result);
	return result;
}

document.getElementsByClassName('hanzi')[0].innerHTML=toHanzi('cmn', '', '{{simplified}}', false);
document.getElementsByClassName('phonetic')[0].innerHTML=toPhonetic('cmn', '{{pinyin}}', false);
document.getElementsByClassName('meaning')[0].innerHTML=toMeaning('cmn', '{{meaning}}', false);
</script>

<div style='font-family: Arial; font-size: 20px;'>{{audio}}</div>
`;
