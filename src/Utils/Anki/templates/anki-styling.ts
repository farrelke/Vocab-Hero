export default `
/* START OF HANPING PREFERENCES */
.cmn_hanzi_type.simp_trad {} /* simp, simp_trad, trad, trad_simp */
.cmn_phonetic_type.pinyin_marked {} /* pinyin_marked, pinyin_numbered, zhuyin_marked, none */
.cmn_coloring_strategy.hanzi {} /* hanzi, phonetic, none */
.cmn_tone1 {color: dodgerblue;} /* #RRGGBB or blue, red etc */
.cmn_tone2 {color: forestgreen;}
.cmn_tone3 {color: darkorange;}
.cmn_tone4 {color: crimson;}
.cmn_tone5 {color: grey;}
/* END OF HANPING PREFERENCES */

.card {font-family: sans-serif; font-size: 20px; text-align: center; color: #222222;}
a {pointer-events: none; text-decoration: none; color: #222222;}
.android a {pointer-events: auto;}
.night_mode a {text-decoration: none; color: white;}
.hanzi {font-size: 48px;}
.phonetic {font-size: 24px;}
.english {font-size: 32px;}
.meaning {font-size: 20px;}
.links_button {
	display: none; padding: 8px 16px 6px 16px;
	border-style: solid; border-width: 1px 1px; border-radius: 4px;
	text-align: center; text-decoration: none; font-size: 14px;
}
.android .links_button {display:inline-block;}
.play_button {display: none; padding: 12px 12px;}
.android .play_button {display:inline-block;}
.play_icon {
	box-sizing: border-box; width: 18px; height: 24px;
	border-top: 12px solid transparent; border-left: 18px solid; border-bottom: 12px solid transparent;
}
`;
