export default `
<!--
"Hanping Chinese Templates for Anki" by EmberMitre is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.

Hanping Chinese Dictionary on Google Play: https://play.google.com/store/apps/details?id=com.embermitre.hanping.app.pro
-->
<span class=hanzi>{{text:simplified}}</span><br><br><a class=play_button href='android-app://com.embermitre.hanping.app.pro#Intent;action=com.hanpingchinese.cmn.intent.action.PLAY;S.p={{text:pinyin}};S.s={{text:simplified}};S.t='';S.LANG=cmn;S._SOURCE=anki;end'><div class=play_button><div class=play_icon></div></div></a><br>
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
		var spanPatt = /(<span class="?(?:[a-z]{3}_)?tone\d"?>)(.+?)(<\/span>)/;
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
		return result.replace(/<span class="?(?:[a-z]{3}_)?tone\d"?>(.+?)<\/span>/g, '$1');
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

document.getElementsByClassName('hanzi')[0].innerHTML=toHanzi('cmn', '', '{{simplified}}', true);
</script>
`;
