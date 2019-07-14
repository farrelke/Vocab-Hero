export function getTextLengthDiv(testDivId: string, text: string) {
  // re-use canvas object for better performance
  const testDiv = document.getElementById(testDivId);
  testDiv.innerHTML = text;
  return testDiv.clientWidth;
}

export function isChineseChar(char: string): boolean {
  return /[\u4E00-\u9FCC\u3400-\u4DB5]/i.test(char);
}

export function stripHtml(text: string) {
  if (!text) return "";
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.body.textContent || "";
}

export function getTextLines(
  divWidth: number,
  testDivId: string,
  text: string
): string[] {
  console.log(divWidth, testDivId, text);
  const lines: string[] = [];
  const textLines = text.split("\n");

  textLines.forEach(line => {
    const words = line.split(" ");
    let testSentence = "";

    words.forEach(word => {
      if (word.length && isChineseChar(word[0])) {
        word.split("").forEach(letter => {
          const width = getTextLengthDiv(testDivId, testSentence + letter);
          if (width > divWidth) {
            lines.push(testSentence);
            testSentence = "";
          }
          testSentence += letter;
        });
      } else {
        const width = getTextLengthDiv(testDivId, testSentence + word);
        if (width > divWidth) {
          lines.push(testSentence);
          testSentence = "";
        }
        testSentence += word + " ";
      }
    });

    if (testSentence !== "" || words.length === 0) {
      lines.push(testSentence);
    }
  });

  return lines;
}

export const stopWords: { [word: string]: boolean } = [
  "a",
  "also",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "but",
  "else",
  "ever",
  "every",
  "for",
  "from",
  "get",
  "got",
  "had",
  "has",
  "have",
  "he",
  "her",
  "hers",
  "him",
  "his",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "me",
  "my",
  "of",
  "our",
  "she",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "to",
  "us",
  "was",
  "we",
  "were",
  "will",
  "with",
  "would",
  "yet",
  "you",
  "your"
].reduce((t, k) => {
  t[k] = true;
  return t;
}, {});
