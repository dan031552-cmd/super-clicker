# סופר לחיצות — מדריך למתחילים

זהו משחק קטן שבנוי משלושה חלקים: **HTML** הוא השלד, **CSS** הוא הצבעים והעיצוב, ו־**JavaScript** הוא המוח שמפעיל את המשחק.

## איך מפעילים?

פותחים את הקובץ `index.html` בדפדפן. לא צריך שרת ולא צריך להתקין תוכנה מיוחדת.

## מה עושים במשחק?

1. לוחצים על **התחל משחק**.
2. מזיזים את הדמות בעזרת מקשי החצים או W, A, S, D.
3. לוחצים על הכוכב כאשר הדמות נוגעת בו.
4. כל תפיסה מוסיפה נקודה, והכוכב עובר למקום אחר.
5. אפשר לבחור שועל, חתול או דוב. הבחירה היא ידנית ולא רנדומלית.

## הסבר HTML — השלד של האתר

- `<!DOCTYPE html>` אומר לדפדפן להשתמש בגרסה המודרנית של HTML.
- `<html lang="he" dir="rtl">` אומר שהעמוד בעברית ושהכיוון הוא מימין לשמאל.
- `<head>` מכיל מידע על העמוד שאינו מוצג בתוך המשחק עצמו.
- `<meta charset="UTF-8">` מאפשר להציג עברית וסימנים כמו כוכבים.
- `<meta name="viewport" ...>` גורם לעמוד להתאים גם לטלפון.
- `<title>` הוא השם שמופיע בלשונית הדפדפן.
- `<link rel="stylesheet" ...>` מחבר את קובץ העיצוב `style.css`.
- `<body>` מכיל את כל מה שהשחקן רואה.
- `<header>` הוא החלק העליון של האתר.
- `<h1>` הוא הכותרת הראשית.
- `<nav>` הוא אזור הניווט. כל `<a href="#...">` הוא קישור שקופץ לחלק המתאים.
- `<main>` מכיל את התוכן המרכזי.
- `<section>` מחלק את העמוד לאזורים: משחק, דמויות והוראות.
- `id="gameArea"` נותן לאזור המשחק שם ייחודי, כדי ש־JavaScript יוכל למצוא אותו.
- `<span id="timer">0</span>` הוא המקום שבו המספר של הטיימר מוצג.
- `<button>` יוצר כפתור שאפשר ללחוץ עליו.
- `<img src="assets/fox.svg">` מציג תמונה מקובץ SVG מקומי. זו אינה תמונה אקראית.
- `data-character="fox"` הוא מידע קטן שמספר ל־JavaScript איזו דמות נבחרה.
- `<footer>` הוא החלק התחתון, ובו זכויות היוצרים.
- `<script src="script.js">` מחבר את המוח של המשחק לעמוד.

## הסבר CSS — הצבעים והעיצוב

- `* { box-sizing: border-box; }` גורם לרוחב ולגובה לכלול גם את הגבולות והרווחים. זה מקל על חישובים.
- `body` מעצב את כל הדף: גופן, צבע טקסט ורקע.
- `background: linear-gradient(...)` יוצר רקע עם מעבר בין צבעים.
- `.site-header` מעצב את הכותרת העליונה.
- `display: flex` מסדר פריטים בשורה או בעמודה בצורה גמישה.
- `justify-content: center` ממקם פריטים במרכז.
- `gap` יוצר רווח בין פריטים.
- `border-radius` מעגל פינות, כדי שהעיצוב ייראה רך וידידותי לילדים.
- `box-shadow` מוסיף צל.
- `.game-area { position: relative; }` אומר שהדמויות שבתוכו יכולות לזוז ביחס לאזור המשחק.
- `.player, .target { position: absolute; }` מאפשר למקם את השחקן והכוכב במיקום מדויק.
- `transition` גורם לשינוי להיראות חלק.
- `@keyframes pulse` מגדיר אנימציית פעימה לכוכב.
- `animation: pulse 1s infinite alternate` מפעיל את האנימציה שוב ושוב.
- `@media` משנה את גובה אזור המשחק במסכים קטנים, כמו טלפון.

## הסבר JavaScript — המוח של המשחק

### משתנים

```js
let seconds = 0;
```
יוצר קופסה בשם `seconds` ומכניס לתוכה 0. בקופסה הזאת נשמור את מספר השניות.

```js
let score = 0;
let realTimer = null;
let gameStarted = false;
let playerX = 20;
let playerY = 20;
```
`score` הוא הניקוד, `realTimer` ישמור את השעון, `gameStarted` אומר האם המשחק פעיל, ו־`playerX` ו־`playerY` הם המיקום של השחקן.

### מציאת חלקים מה־HTML

```js
const timer = document.getElementById("timer");
```
`document` הוא כל עמוד האינטרנט. הפקודה `getElementById` מחפשת את האלמנט שה־`id` שלו הוא `timer`.

אותו רעיון משמש גם עבור הניקוד, אזור המשחק, השחקן, הכוכב והכפתורים. `const` אומר שהחיבור לאלמנט נשאר קבוע.

### איפוס

```js
function reset() {
  clearInterval(realTimer);
  seconds = 0;
  score = 0;
  gameStarted = false;
```
`function` מגדיר פעולה בשם `reset`. הפעולה עוצרת את השעון, מחזירה את הזמן והניקוד לאפס, ומסמנת שהמשחק אינו פעיל.

```js
  playerX = 20;
  playerY = 20;
  timer.textContent = seconds;
  scoreText.textContent = score;
```
מחזיר את השחקן לפינה ומציג את הערכים החדשים על המסך.

### הטיימר

```js
function startTimer() {
  clearInterval(realTimer);
  realTimer = setInterval(function () {
    seconds = seconds + 1;
    timer.textContent = seconds;
  }, 1000);
}
```
`setInterval` מפעיל פעולה שוב ושוב. המספר `1000` הוא 1000 אלפיות שנייה, כלומר שנייה אחת. בכל שנייה מוסיפים 1 ומציגים את המספר.

```js
function stopTimer() {
  clearInterval(realTimer);
  realTimer = null;
}
```
`clearInterval` עוצר את השעון. `null` אומר שאין כרגע שעון פעיל.

### התחלת המשחק

```js
function startGame() {
  reset();
  gameStarted = true;
  startTimer();
  startButton.textContent = "המשחק רץ";
  moveTarget();
}
```
כשלוחצים על התחלה, מאפסים הכול, מפעילים את המשחק, מתחילים את הטיימר ומעבירים את הכוכב למקום חדש.

### העברת הכוכב

`Math.random()` נותן מספר אקראי. לכן הכוכב זז למקום שונה בכל משחק. שים לב: **זה לא מחליף את הדמות**. הדמות נבחרת בכפתור קבוע.

`Math.floor` מעגל מספר כלפי מטה. `maxX` ו־`maxY` מונעים מהכוכב לצאת מגבולות אזור המשחק.

### בדיקה אם תפסנו את הכוכב

`getBoundingClientRect()` מחזיר את המלבן של כל אלמנט על המסך. ארבע בדיקות משוות בין הצדדים של השחקן והכוכב. אם המלבנים חופפים, הפונקציה מחזירה `true` — כלומר יש מגע.

### לחיצה על הכוכב

אם המשחק לא התחיל, `return` יוצא מהפונקציה ולא עושה כלום. אם השחקן נוגע בכוכב, מוסיפים 1 לניקוד, מציגים אותו ומעבירים את הכוכב. אם אין מגע, הכוכב רועד מעט כדי לומר לשחקן: נסה להתקרב.

### תנועת השחקן

```js
 document.addEventListener("keydown", movePlayer);
```
אומר לדפדפן: בכל פעם שנלחץ מקש, הפעל את `movePlayer`.

בתוך הפונקציה בודקים את `event.key`. אם זה חץ ימינה או האות `d`, מוסיפים 10 ל־X. שמאלה מפחיתים מ־X. למטה מוסיפים ל־Y ולמעלה מפחיתים מ־Y.

```js
playerX = Math.max(0, Math.min(playerX, maxX));
```
זו גדר ביטחון: השחקן לא יכול לעבור שמאלה מדי, ימינה מדי, למעלה מדי או למטה מדי.

```js
player.style.transform = `translate(${playerX}px, ${playerY}px)`;
```
מזיז את השחקן על המסך. הסימנים `${...}` מכניסים את המספרים לתוך הטקסט.

### החלפת דמות בלי אקראיות

```js
const characterFaces = {
  fox: "🦊",
  cat: "🐱",
  bear: "🐻"
};
```
זהו מילון: לכל שם יש דמות מתאימה.

`event.currentTarget.dataset.character` קורא את הערך של `data-character` בכפתור שעליו לחצנו. לאחר מכן `player.textContent` מציג את הדמות שבחרנו.

`classList.remove("active")` מוריד את הסימון מהכפתורים הישנים, ו־`classList.add("active")` מסמן את הכפתור החדש.

### חיבור הכפתורים לפעולות

```js
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", reset);
target.addEventListener("click", collectTarget);
```
כל שורה אומרת: כשמתרחש אירוע `click`, הפעל את הפעולה המתאימה.

```js
characterButtons.forEach(function (button) {
  button.addEventListener("click", changeCharacter);
});
```
`forEach` עובר על כל כפתורי הדמויות ומחבר לכל אחד את הפעולה להחלפת דמות.

```js
reset();
```
מפעיל איפוס פעם אחת כשהעמוד נטען, כדי שהמשחק יתחיל במצב מסודר.

## רעיונות לשדרוג בהמשך

אפשר להוסיף שלבים, צלילים, חיים, שיא אישי, כפתור עצירה, מכשולים, דמות עם תמונת PNG, או מצב משחק שבו יש 30 שניות ובהן מנסים להשיג כמה שיותר נקודות.
