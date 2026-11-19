import type { Module } from '../types';
import { workshop } from './workshop';

export const javaModules: Module[] = [
  {
    id: 'java-basics', number: 1, stage: 1, icon: 'terminal', tone: 'sky',
    title: 'צעדים ראשונים ב-Java', short: 'מהקובץ לתוכנית', tagline: 'JDK, סוגי נתונים, תנאים, לולאות ומתודות.',
    why: 'קריאה נכונה של שגיאות והרצה חוזרת הן הבסיס לכל עבודה עם Java.',
    outcomes: ['להתקין JDK 21 ולהריץ מהטרמינל', 'לבחור סוג נתון מתאים', 'לחלק חישוב למתודות שניתן לבדוק'],
    lessons: [
      workshop({
        id: 'l1', title: 'מתחילים מאפס: JDK ותוכנית ראשונה', summary: 'מתקינים JDK 21, בונים קובץ Java ומריצים אותו.', minutes: 25, level: 'basic',
        intro: 'כמו שמתרגם מעביר הוראות כתובות לשפה אחרת, `javac` מתרגם קוד Java ל-Bytecode. ה-JVM מריצה אותו. נכתוב תוכנית ראשונה, נבדוק את התוצאה ונלמד לזהות את ההבדל בין בעיה בבנייה לבין בעיה בהרצה.',
        steps: [['התקנה', 'התקן JDK 21 (למשל Eclipse Temurin). פתח טרמינל חדש והרץ `java -version` ו-`javac -version`. שתיהן צריכות להצביע על הגרסה 21. אם `javac` חסר, חפש את תיקיית `bin` של ה-JDK ובדוק את `PATH`.'], ['קומפילציה', 'שמור את הדוגמה בקובץ בשם `Main.java` ועבור לתיקייה שלו. הרץ `javac Main.java`. בקומפילציה מוצלחת נוצר קובץ `Main.class`.'], ['הרצה', 'הרץ `java Main Ada`. ה-JVM קוראת ל-`main`; כל מילה אחרי שם המחלקה נעשית איבר ב-`args`. הרץ גם `java Main` והשווה.']],
        tradeoff: 'אפשר להריץ `java Main.java` ישירות, אבל הפרדה בין `javac` ל-`java` מקלה להבין באיזה שלב התרחשה התקלה.',
        code: `
public class Main {
    public static void main(String[] args) {
        String name = args.length == 0 ? "learner" : args[0];
        System.out.println("Hello, " + name + "!");
    }
}`,
        notes: '`public class Main` חייב להתאים לשם הקובץ. `static` מאפשר להפעיל את `main` בלי ליצור אובייקט. בדיקת האורך לפני `args[0]` מגינה על ההרצה ללא פרמטרים.',
        pitfalls: [['גרסאות שונות', '`javac` חסר או ההרצה לא תומכת בגרסת הקובץ.', 'הטרמינל מוצא Java ישן או Runtime ללא קומפיילר.', 'בדוק את שתי פקודות הגרסה ועדכן PATH.'], ['שם קובץ שגוי', 'הקומפיילר מבקש קובץ בשם `Main.java`.', 'שם המחלקה הציבורית ושם הקובץ שונים.', 'שמור בשם המדויק, כולל אות גדולה.']],
        terms: [['JDK', 'כלי פיתוח הכוללים קומפיילר וסביבת הרצה.'], ['JVM', 'המכונה הווירטואלית שמריצה Java Bytecode.'], ['Bytecode', 'ההוראות שבקובץ class אחרי קומפילציה.'], ['PATH', 'רשימת תיקיות שבהן הטרמינל מחפש פקודות.']],
        exercise: 'הוסף ברירת מחדל עבור שם ריק, ותעד את הפלט של שתי הרצות.',
        checks: ['`java Main Ada` מדפיסה `Hello, Ada!`.', '`java Main ""` (או הרצה ללא פרמטר) מדפיסה `Hello, learner!`.'],
        hints: ['קרא על `String.isBlank()`.', 'בדוק קודם את `args.length` כדי לא לקרוא איבר שלא קיים.'],
        solution: 'החלף את תנאי הבחירה ב-`args.length == 0 || args[0].isBlank()`. האופרטור `||` מפסיק לבדוק ברגע שהתנאי השמאלי נכון.',
        quiz: [['איזו פקודה יוצרת את Main.class?', ['java Main', 'javac Main.java', 'java -version'], 1, '`javac` הוא הקומפיילר.'], ['מה מודפס ללא פרמטרים?', ['Hello, learner!', 'Hello, null!', 'שגיאת אינדקס'], 0, 'בדיקת האורך בוחרת את ברירת המחדל.']],
      }),
      workshop({
        id: 'l2', title: 'טיפוסים, תנאים וחישובים מדויקים', summary: 'מחשבים סך הזמנה באגורות בלי שגיאת עיגול.', minutes: 35, level: 'basic',
        intro: 'קופה בפינת הרחוב סופרת מטבעות, לא שברים בינאריים. ב-Java בחירת הטיפוס משפיעה על טווח הערכים והדיוק. נייצג כסף באגורות, נפריד תנאי עסקי מהדפסה ונציב גבול שבו ההנחה מתחילה.',
        steps: [['Representation', 'בחר `long` לסכומים שלמים באגורות. `double` מייצג ערכים בינאריים מקורבים; חישובים כספיים בשברים או במטבעות עם כללי עיגול שונים יכולים להזדקק ל-`BigDecimal` ולכלל עיגול מפורש.'], ['Validation', 'הגדר טווח לקלט לפני החשבון. הדוגמה מגבילה מחיר וכמות כך שהמכפלה וחישוב האחוזים לא יחרגו מ-`long`. ערך שלילי אינו מתוקן בשקט.'], ['Policy', 'החל הנחה רק מסף מוגדר. בחלוקת ערכים שלמים השארית נחתכת, לכן צריך להחליט אם לעגל את ההנחה או את המחיר הסופי.']],
        tradeoff: 'בדוק ערך בדיוק בסף, אחד מתחתיו ואחד מעליו. בדיקה רק להזמנה גדולה לא מזהה בלבול בין `>` לבין `>=`.',
        code: `
public class Main {
    static long total(long unitCents, int quantity) {
        if (unitCents < 0 || unitCents > 1_000_000_000L || quantity < 1 || quantity > 10_000) {
            throw new IllegalArgumentException("Invalid price or quantity");
        }
        long subtotal = unitCents * quantity;
        long discount = subtotal >= 5_000 ? subtotal / 10 : 0;
        return subtotal - discount;
    }
    public static void main(String[] args) {
        System.out.println(total(2_501, 2));
    }
}`,
        notes: '`L` מסמן ליטרל מסוג `long`. עבור 5002 אגורות ההנחה היא 500 והפלט 4502. המתודה לא מדפיסה בעצמה ולכן קל לבדוק אותה.',
        pitfalls: [['הצפה', 'סכום חיובי הופך לשלילי.', 'המכפלה חורגת מטווח הטיפוס.', 'הגבל את הקלט או השתמש ב-`Math.multiplyExact`.'], ['עיגול לא מוסכם', 'הקופה והחשבונית מציגות הבדל של אגורה.', 'שני חישובים מעגלים בשלבים שונים.', 'הגדירו כלל אחד ובדקו ערכים עם שארית.']],
        terms: [['Primitive', 'טיפוס בסיסי כמו int, long או boolean.'], ['Overflow', 'חריגה מטווח הערכים שהטיפוס יכול לייצג.'], ['Guard Clause', 'בדיקה מוקדמת העוצרת קלט לא תקין.'], ['Integer Division', 'חלוקת שלמים שמשמיטה את החלק השברי.']],
        exercise: 'הוסף משלוח שעולה 400 אגורות להזמנה שסכומה לפני הנחה קטן מ-3000.',
        checks: ['בסכום 2999 המחיר הסופי הוא 3399.', 'בסכום 3000 אין דמי משלוח.', 'בדיקות המחיר והכמות נשארות.'],
        hints: ['חשב את המשלוח מה-subtotal ולא מהתוצאה אחרי ההנחה.'],
        solution: 'אחרי חישוב ההנחה, הוסף `long shipping = subtotal < 3_000 ? 400 : 0;` והחזר `subtotal - discount + shipping`.',
        quiz: [['מה התוצאה עבור 5002 אגורות לפני הנחה?', ['4500', '4502', '4501'], 1, 'החלוקה בשלמים נותנת הנחה של 500.'], ['איזה מקרה בודק את גבול ההנחה בצורה הטובה ביותר?', ['10000 בלבד', '5000 בלבד', '4999, 5000 ו-5001'], 2, 'שלושת הערכים מכסים את הגבול ואת שני הצדדים שלו.']],
      }),
      workshop({
        id: 'l3', title: 'מערכים, לולאות ומתודות', summary: 'מעבדים מדידות, סופרים חריגות ובודקים גבולות.', minutes: 35, level: 'basic',
        intro: 'כמו שבודקים כל פריט ברשימת קניות, לולאה עוברת פריט אחר פריט. נעבד מערך מדידות, נחזיר ערך ולא רק נדפיס, ונבחן מתי לולאה רגילה עדיפה על אינדקסים.',
        steps: [['Array', 'מערך מסוג `int[]` מחזיק מספר קבוע של ערכים. אורכו זמין ב-`length`. האינדקס הראשון הוא אפס והאחרון `length - 1`.'], ['Iteration', 'לולאת `for-each` נותנת את הערך בכל איטרציה. השתמש בלולאה עם אינדקס רק אם צריך גם את המיקום או מבט לשכן.'], ['Return', 'החזר את המונה למי שקרא למתודה. מערך ריק נותן אפס. סיבוכיות הזמן היא O(n) והזיכרון הנוסף O(1).']],
        tradeoff: 'אם צריך רק תשובת כן/לא, החזר מיד עם החריגה הראשונה. אם צריך לספור את כולן, אי אפשר לעצור מוקדם.',
        code: `
public class Main {
    static int countAbove(int[] measurements, int limit) {
        int count = 0;
        for (int value : measurements) {
            if (value > limit) {
                count++;
            }
        }
        return count;
    }
    public static void main(String[] args) {
        int[] latency = {40, 90, 100, 115, 160};
        System.out.println(countAbove(latency, 100));
    }
}`,
        notes: 'הפלט הוא `2`. הסף `100` עצמו אינו נספר. המתודה לא משנה את המערך וקל להפעיל אותה שוב עם סף אחר.',
        pitfalls: [['חריגה מאינדקס', 'הקוד קורס בסוף הלולאה.', '`i <= array.length` מאפשר גישה אחרי האיבר האחרון.', 'השתמש ב-`i < array.length` או ב-for-each.'], ['סף שגוי', 'ערך ששווה בדיוק לסף נספר.', 'נעשה שימוש ב-`>=` במקום `>`.', 'כתוב בדיקה עבור ערך שווה לסף.']],
        terms: [['Array', 'אוסף באורך קבוע עם אינדקס לכל ערך.'], ['Iteration', 'צעד אחד בתוך לולאה.'], ['Method', 'פעולה בעלת שם, פרמטרים וערך חזרה אפשרי.'], ['Big-O', 'דרך לתאר איך עלות האלגוריתם גדלה כשגודל הקלט עולה.']],
        exercise: 'כתוב `firstAbove` המחזירה את האינדקס של החריגה הראשונה, או ‎-1 אם אין חריגה.',
        checks: ['עבור הדוגמה והסף 100 הפלט הוא 3.', 'מערך ריק מחזיר ‎-1.', 'אין שינוי במערך.'],
        hints: ['צריך את האינדקס, ולכן כדאי להשתמש בלולאת `for` עם מונה.'],
        solution: '`for (int i = 0; i < measurements.length; i++) { if (measurements[i] > limit) return i; } return -1;`',
        quiz: [['איזה ערך נותן countAbove עבור מערך ריק?', ['0', '1', '‎-1'], 0, 'הלולאה לא רצה והמונה נשאר אפס.'], ['מה הזמן במקרה הגרוע?', ['O(1)', 'O(n)', 'O(n²)'], 1, 'כל ערך נקרא פעם אחת.']],
      }),
    ],
  },
  {
    id: 'java-modeling', number: 2, stage: 1, icon: 'code', tone: 'indigo',
    title: 'מודלים, אובייקטים ו-Collections', short: 'אובייקטים ואוספים', tagline: 'בונים ספריית השאלות עם Records, Interfaces ומפות.',
    why: 'מודל טוב שומר על כללים עסקיים ומצמצם שגיאות בין חלקי המערכת.',
    outcomes: ['לאכוף invariant בבנאי', 'לבחור בין List, Set ו-Map', 'להחליף מימוש בלי לשנות את השירות'],
    lessons: [
      workshop({
        id: 'l1', title: 'Class, Record וכללים עסקיים', summary: 'מגדירים ספר שלא ניתן ליצור עם מזהה או כותרת ריקים.', minutes: 40, level: 'basic',
        intro: 'כרטיס של ספר בקטלוג כולל כמה שדות ששייכים יחד. `record` מתאים לערך מובנה; מחלקה רגילה מתאימה כשצריך מצב משתנה עם מעברים מבוקרים. בשניהם עדיף למנוע ערך פגום כבר ביצירה.',
        steps: [['Model', 'תן שם לערך העסקי והגדר רכיבים עם טיפוסים. `record` מספק accessors, השוואה לפי רכיבים ו-`hashCode`.'], ['Invariant', 'הבנאי הקומפקטי פועל לפני השמת הרכיבים. אפשר לדחות ערך לא חוקי וגם לנרמל רווחים.'], ['Equality', 'שני Records עם אותם ערכי רכיבים שווים ב-`equals` גם אם נוצרו באתרים שונים. זה לא בהכרח זהות עסקית: מערכת עשויה לזהות ספר לפי מזהה בלבד.']],
        tradeoff: 'Record הוא immutable רק באופן שטחי. עבור List ברכיב, השתמש ב-`List.copyOf` אם המודל צריך להגן מפני שינוי חיצוני.',
        code: `
public class Main {
    record Book(String id, String title) {
        Book {
            if (id == null || id.isBlank() || title == null || title.isBlank()) {
                throw new IllegalArgumentException("Book requires id and title");
            }
            id = id.strip();
            title = title.strip();
        }
    }
    public static void main(String[] args) {
        Book a = new Book(" b1 ", "Java Basics");
        Book b = new Book("b1", "Java Basics");
        System.out.println(a.title());
        System.out.println(a.equals(b));
    }
}`,
        notes: '`Book` מקונן בתוך `Main`. שינוי הפרמטרים בבנאי הקומפקטי קובע אילו ערכים נשמרים. הפלט השני הוא `true`.',
        pitfalls: [['השוואה שגויה', 'שני ספרים זהים נראים שונים.', '`==` משווה הפניות.', 'השתמש ב-`equals` לערכים.'], ['אימות מאוחר', 'הקוד מקבל כותרת ריקה ואז נכשל עמוק בשרת.', 'המודל לא אוכף כלל בכניסה.', 'דחה את הקלט בבנאי ובדוק גם את הגבול החיצוני.']],
        terms: [['Record', 'טיפוס ערך עם רכיבים קבועים והתנהגות שוויון מובנית.'], ['Invariant', 'תנאי שאובייקט חייב לקיים בכל מצב תקין.'], ['Constructor', 'הפעולה שמכשירה מופע לשימוש.']],
        exercise: 'הוסף שנת פרסום חוקית בין 1450 ל-2100, כולל שני הקצוות.',
        checks: ['1450 ו-2100 מתקבלות.', '1449 ו-2101 נדחות.', 'שני ספרים עם שנים שונות אינם שווים.'],
        hints: ['הוסף רכיב `int year` ובצע בדיקה בבנאי הקומפקטי.'],
        solution: 'הגדר `record Book(String id, String title, int year)` והוסף `if (year < 1450 || year > 2100) throw new IllegalArgumentException("Invalid year");`. עדכן את כל הקריאות לבנאי.',
        quiz: [['מה משווה equals ברירת מחדל של Record?', ['כתובת זיכרון', 'רק הרכיב הראשון', 'את ערכי הרכיבים'], 2, 'כל הרכיבים משתתפים בשוויון.'], ['האם Record עוצר שינוי של List שהועברה לבנאי?', ['לא, בלי העתקה', 'כן תמיד', 'רק כאשר הרשימה ריקה'], 0, 'הרכיב לא משתנה להפניה אחרת, אבל תוכן הרשימה עדיין עשוי להשתנות.']],
      }),
      workshop({
        id: 'l2', title: 'List, Set, Map ו-Generics', summary: 'סופרים השאלות לפי מזהה ספר ובוחרים אוסף מתאים.', minutes: 40, level: 'intermediate',
        intro: 'דף השאלות שומר רצף, אוסף מזהים ייחודיים מסיר כפילויות, ומפתח בקטלוג מוביל לערך. אלה שלוש דרישות שונות, ולכן שלושה טיפוסי אוספים שונים.',
        steps: [['List', 'השתמש ב-List כשהסדר וכפילויות חשובים. `List.of` יוצר רשימה שאינה ניתנת לשינוי.'], ['Map', '`Map<String, Integer>` מתאר מפתח מסוג String וערך מספרי עטוף. `merge` יוצר מפתח חסר או משלב את הערך הקיים.'], ['Set', 'Set מתאים לשאלת חברות באוסף. `keySet` של Map הוא view; השתמש ב-`Set.copyOf` כדי להחזיר תמונת מצב.']],
        tradeoff: 'בחר `LinkedHashMap` כשסדר הכניסה הוא חלק מהפלט. `HashMap` אינו מבטיח סדר איטרציה.',
        code: `
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Main {
    static Map<String, Integer> counts(List<String> loans) {
        Map<String, Integer> totals = new LinkedHashMap<>();
        for (String id : loans) {
            totals.merge(id, 1, Integer::sum);
        }
        return totals;
    }
    public static void main(String[] args) {
        System.out.println(counts(List.of("b2", "b1", "b2")));
    }
}`,
        notes: 'הפלט הוא `{b2=2, b1=1}`. הפרמטר Generic מונע ערבוב טיפוסים; `Integer::sum` משתתפת רק כאשר קיים ערך למפתח.',
        pitfalls: [['אובדן מידע', 'ספירת השאלות תמיד 1.', 'המרה ל-Set לפני הספירה הסירה כפילויות.', 'ספור את רשומות המקור.'], ['סדר בלתי יציב', 'בדיקות פלט נכשלות לפי סביבת ההרצה.', 'הבדיקה הניחה סדר HashMap.', 'הגדר סדר מפורש או בדוק ערכים לפי מפתח.']],
        terms: [['Generics', 'פרמטרי טיפוס המאפשרים בדיקת טיפוסים בזמן קומפילציה.'], ['Map', 'מיפוי מפתחות ייחודיים לערכים.'], ['Set', 'אוסף ערכים ייחודיים.'], ['List', 'אוסף מסודר שבו כפילויות חוקיות.']],
        exercise: 'החזר מפה מסודרת לפי אלפבית של מזהי הספרים בלי לשנות את הספירה.',
        checks: ['הפלט מתחיל ב-b1.', 'b2 עדיין מופיע עם 2.', 'קלט ריק מחזיר מפה ריקה.'],
        hints: ['`TreeMap` מסדרת מחרוזות לפי הסדר הטבעי.'],
        solution: 'החלף את `new LinkedHashMap<>()` ב-`new java.util.TreeMap<>()`. הספירה נשארת זהה, אבל פעולת מפתח עולה O(log n).',
        quiz: [['איזה אוסף מתאים לספירה לפי מזהה?', ['Map', 'Set', 'List ללא מפתחות'], 0, 'הספירה היא ערך שמתעדכן עבור מפתח.'], ['מה קורה למפתח חסר ב-merge בדוגמה?', ['נגרמת שגיאה', 'נשמר 1', 'נשמר 0'], 1, 'הערך שסופק נכנס ישירות למפה.']],
      }),
      workshop({
        id: 'l3', title: 'Interfaces והפרדת אחסון מלוגיקה', summary: 'כותבים שירות עם Repository שניתן להחליף ולבדוק.', minutes: 45, level: 'intermediate',
        intro: 'בספרייה הקורא רואה דלפק, לא את שיטת סידור המחסן. `interface` מקבע חוזה בין שירות לאחסון. משתמשים במימוש זיכרון בבדיקות, ובהמשך אפשר לחבר מסד נתונים מבלי לחייב את השירות להכיר SQL.',
        steps: [['Contract', 'החוזה `findTitle` מחזיר `Optional.empty()` כאשר אין מזהה. כשל באחסון אינו שקול לערך חסר ויש להחזיר אותו כשגיאה.'], ['Injection', 'העבר Repository בבנאי במקום ליצור אותו בעצמך בשירות. ניתן לספק מימוש בזיכרון, בדיקה או SQL דרך אותה חתימה.'], ['Composition', 'ב-`main` יוצרים את החלקים ומחברים אותם. `Optional.orElse` מטפל במצב צפוי של ספר חסר ומאפשר לממשק להציג הודעה.']],
        tradeoff: 'בנה ממשק סביב פעולות שהדומיין צריך. ממשק CRUD כללי מדי עלול להסתיר אילוצים חשובים כמו יצירה רק אם מזהה עדיין לא קיים.',
        code: `
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

public class Main {
    interface Catalog {
        Optional<String> findTitle(String id);
    }
    static final class Library {
        private final Catalog catalog;
        Library(Catalog catalog) {
            this.catalog = Objects.requireNonNull(catalog);
        }
        String displayTitle(String id) {
            return catalog.findTitle(id).orElse("Book not found");
        }
    }
    public static void main(String[] args) {
        Map<String, String> books = Map.of("b1", "Java Basics");
        Library library = new Library(id -> Optional.ofNullable(books.get(id)));
        System.out.println(library.displayTitle("b1"));
        System.out.println(library.displayTitle("b2"));
    }
}`,
        notes: 'ב-`Catalog` יש מתודה מופשטת אחת, ולכן lambda יכולה לממש אותו. ה-`Library` לא יודעת אם הערך מגיע ממפה או ממסד. `Optional.ofNullable` ממירה תשובת `null` ל-empty.',
        pitfalls: [['תלות קשיחה', 'כדי לבדוק חיפוש חייבים להקים מסד נתונים.', 'השירות בונה בעצמו את האחסון.', 'העבר את התלות דרך הבנאי.'], ['הסתרת כשל', 'ניתוק למסד מוצג כ״אין ספר״.', 'המימוש מחזיר Optional ריק גם בחריגה.', 'הבדל בין ערך חסר לכשל I/O.']],
        terms: [['Interface', 'חוזה המפרט פעולות בלי לקבע מימוש.'], ['Dependency Injection', 'העברת תלות מבחוץ במקום יצירתה בתוך הצרכן.'], ['Optional', 'ערך שמייצג נוכחות או היעדר תשובה.']],
        exercise: 'כתוב מימוש בדיקה שמדווח בדיוק אילו מזהים הגיעו לאחסון.',
        checks: ['חיפוש b1 מחזיר Java Basics.', 'חיפוש חסר מחזיר Book not found.', 'אפשר לאמת שני מזהים לפי הסדר.'],
        hints: ['הוסף `ArrayList<String>` לצד המפה.', 'ה-lambda יכולה להכיל בלוק עם `return`.'],
        solution: 'הגדר `var seen = new java.util.ArrayList<String>();`, ואז ספק `id -> { seen.add(id); return Optional.ofNullable(books.get(id)); }`. בדוק ש-`seen.equals(java.util.List.of("b1", "b2"))`.',
        quiz: [['איפה בדוגמה נקבע מימוש האחסון?', ['בשירות Library', 'ב-main', 'בתוך Optional'], 1, 'נקודת החיבור יוצרת ומעבירה את המימוש.'], ['מתי מתאים Optional.empty()?', ['אין ספר למזהה', 'כשל חיבור למסד', 'כל חריגה'], 0, 'ערך חסר הוא תוצאה צפויה; כשל תשתית הוא שגיאה.']],
      }),
    ],
  },
  {
    id: 'java-quality', number: 3, stage: 2, icon: 'code', tone: 'teal',
    title: 'נתונים, שגיאות ובדיקות', short: 'תוכנה אמינה', tagline: 'מעבדים נתונים בלי להסתיר תקלות, ומוכיחים את החוזה בבדיקות.',
    why: 'שגיאה גלויה ובדיקה חוזרת עדיפות על דוח שנראה תקין אבל איבד מידע.',
    outcomes: ['לקרוא קבצים עם ניהול משאבים', 'לבנות Pipeline של Streams', 'לבדוק התנהגות וגבולות'],
    lessons: [
      workshop({
        id: 'l1', title: 'Exceptions וקבצים', summary: 'קוראים יומן השאלות ומדווחים את שורת הקלט הפגומה.', minutes: 45, level: 'intermediate',
        intro: 'כמו טופס שאי אפשר לקרוא, רשומת קלט לא תקינה לא צריכה להיעלם מהדוח. נבדיל בין קובץ שאי אפשר לפתוח לבין שורה שצריך לתקן.',
        steps: [['I/O', 'שמור קובץ בשם `loans.txt` ובו מזהה ספר אחד בכל שורה. `Files.newBufferedReader` קורא UTF-8 וזורק IOException כאשר הפתיחה או הקריאה נכשלת.'], ['Parsing', 'שמור מספר שורה לפני אימות. השתמש ב-`strip` להסרת רווחים. מדיניות הדוגמה היא לעצור על השורה הריקה הראשונה, לא לספור חלקית.'], ['Cleanup', '`try-with-resources` סוגר את הקורא בסיום, גם לאחר חריגה. `main` מתרגם כשל להודעה ב-stderr ולקוד יציאה שאוטומציה יכולה לזהות.']],
        tradeoff: 'בעיבוד אצווה אפשר לדווח כמה שורות פסולות יחד, אבל אסור להציג הצלחה אם הדוח חלקי ולא מסומן.',
        code: `
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    static int countLoans(Path path) throws IOException {
        int lineNumber = 0;
        try (var reader = Files.newBufferedReader(path)) {
            for (String line; (line = reader.readLine()) != null;) {
                lineNumber++;
                if (line.isBlank()) {
                    throw new IllegalArgumentException("Empty ID at line " + lineNumber);
                }
            }
        }
        return lineNumber;
    }
    public static void main(String[] args) {
        try {
            System.out.println(countLoans(Path.of("loans.txt")));
        } catch (IOException | IllegalArgumentException e) {
            System.err.println("Cannot count loans: " + e.getMessage());
            System.exit(1);
        }
    }
}`,
        notes: 'הרץ פעם עם שתי שורות תקינות, פעם עם שורה ריקה באמצע ופעם ללא הקובץ. רק ההרצה הראשונה מדפיסה ספירה. קובץ ריק תקין ומחזיר 0.',
        pitfalls: [['הצלחה מזויפת', 'קובץ חסר מוצג כאפס השאלות.', 'הקוד ממיר IOException ל-0.', 'דווח כשל והחזר קוד יציאה שאינו 0.'], ['דליפת משאב', 'הרצות רבות משאירות קבצים פתוחים.', 'הקורא לא נסגר אחרי חריגה.', 'הכרז עליו ב-try-with-resources.']],
        terms: [['IOException', 'כשל בפעולה כמו פתיחה או קריאה של קובץ.'], ['try-with-resources', 'מבנה שסוגר משאב אוטומטית בסוף הבלוק.'], ['Exit Code', 'מספר שהתהליך מחזיר למערכת; 0 מציין הצלחה.']],
        exercise: 'אפשר הערות בשורות שמתחילות ב-# והמשך לאסור שורות ריקות.',
        checks: ['הערות לא נספרות.', 'מספר השורה בהודעה עדיין פיזי.'],
        hints: ['החזק מונה תוצאות ומונה שורות נפרדים.'],
        solution: 'קדם `lineNumber` לכל שורה; אחרי בדיקת ריק השתמש ב-`if (line.stripLeading().startsWith("#")) continue;`. קדם `count` רק עבור רשומה תקינה והחזר אותו.',
        quiz: [['מי סוגר את הקורא בעת חריגה?', ['המשתמש', 'try-with-resources', 'System.out'], 1, 'סגירה מתבצעת ביציאה מהבלוק.'], ['מה מייצג קוד יציאה 1?', ['כשל', 'שורה אחת', 'הצלחה'], 0, 'קוד שאינו אפס מציין כשל בממשק הפקודות הזה.']],
      }),
      workshop({
        id: 'l2', title: 'Streams, Lambdas ואגרגציה', summary: 'מסננים השאלות פעילות ומפיקים תמונת מצב לפי חבר.', minutes: 45, level: 'intermediate',
        intro: 'כמו בפס ייצור, כל תחנה מבצעת שינוי קטן: מסננת, בוחרת ערך או מסכמת. Stream מתאר מעבר אחד על נתונים; הוא לא אוסף לאחסון.',
        steps: [['Filter', 'שמור רק השאלות פעילות. בדוגמה השאלה שלא הוחזרה פעילה, בלי תלות בשעון המחשב.'], ['Group', '`groupingBy` בוחר מפתח לקבוצה. `counting` מחזיר Long לכל קבוצה; ערך חסר במפה אינו אפס מובנה.'], ['Read', 'הסיום ב-`collect` מפעיל את ה-Pipeline. הדפס לפי מפתחות מפורשים כדי לא להסתמך על סדר המפה.']],
        tradeoff: 'Stream אינו תמיד ברור יותר. אם יש עצירה מורכבת או דיווח שגיאות לכל שורה, לולאה מפורשת עשויה להיות קלה יותר לבדיקה.',
        code: `
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Main {
    record Loan(String member, boolean returned) {}

    static Map<String, Long> activeByMember(List<Loan> loans) {
        return loans.stream()
            .filter(loan -> !loan.returned())
            .collect(Collectors.groupingBy(Loan::member, Collectors.counting()));
    }
    public static void main(String[] args) {
        var counts = activeByMember(List.of(new Loan("Ada", false),
            new Loan("Ada", true), new Loan("Sam", false)));
        System.out.println(counts.getOrDefault("Ada", 0L));
    }
}`,
        notes: 'הפלט של Ada הוא 1, לא 2. ההפניה `Loan::member` שקולה ל-`loan -> loan.member()`. פונקציית הסיכום אינה משנה את רשימת הקלט.',
        pitfalls: [['ספירה כפולה', 'השאלות שהושבו מופיעות בדוח פעילות.', 'הסינון רץ אחרי הספירה.', 'סנן לפני groupingBy.'], ['תופעת לוואי', 'ספירה לא יציבה בהרצה במקביל.', 'ה-lambda משנה מונה חיצוני משותף.', 'השתמש ב-Collector מתאים בלי מצב חיצוני.']],
        terms: [['Stream', 'Pipeline חד-פעמי לעיבוד רצף נתונים.'], ['Collector', 'מתכון לצבירת תוצאות Stream.'], ['Lambda', 'ביטוי המגדיר גוף פעולה קצר.']],
        exercise: 'הפק את שמות החברים הפעילים בסדר אלפביתי, בלי כפילויות.',
        checks: ['Ada ו-Sam מופיעים פעם אחת.', 'חבר עם השאלות מוחזרות בלבד לא מופיע.'],
        hints: ['אחרי הסינון אפשר למפות לשם.', 'סיים ב-`toList()`.'],
        solution: '`loans.stream().filter(l -> !l.returned()).map(Loan::member).distinct().sorted().toList()`.',
        quiz: [['איזו פעולה מפעילה את העיבוד?', ['collect', 'filter', 'stream'], 0, '`collect` היא פעולה סופית.'], ['מה עושה groupingBy?', ['מוחקת כפילויות', 'מחלקת רשומות לפי מפתח', 'קובעת סדר אלפביתי'], 1, 'הרשומות משויכות לקבוצה לפי ערך המפתח.']],
      }),
      workshop({
        id: 'l3', title: 'בדיקות יחידה וחוקי זמן', summary: 'בודקים חישוב קנס עם תאריך קבוע במקום להסתמך על עכשיו.', minutes: 45, level: 'intermediate',
        intro: 'סרגל מדידה משתנה ייתן תוצאה שונה בכל ניסיון. תאריך שמועבר מבחוץ הופך בדיקה לחוזרת גם בלילה, בסוף חודש ובשרת באזור זמן אחר.',
        steps: [['Input', 'תאריך החזרה ותאריך יעד הם `LocalDate`. מי שקורא למתודה מחליט לפי איזה אזור זמן נקבע היום.'], ['Boundary', 'דרישת הדוגמה: מחייבים 200 אגורות לכל יום אחרי היעד, עם תקרה של 1000. בודקים יעד, יום אחרי, ולפחות 6 ימים אחרי.'], ['Feedback', 'בדיקה תלויה בתוצאה צפויה ולא במימוש. `check` מטילה AssertionError על הבדל בלי להזדקק לדגל `-ea`. בפרויקט Maven כדאי להעביר מקרים כאלה ל-JUnit ולהריץ `mvn test`.']],
        tradeoff: 'אל תדמה זמן על ידי המתנה. העבר `LocalDate` או הזרק `Clock`, ואז הרץ את אותה בדיקה בכל סביבה.',
        code: `
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Main {
    static long fee(LocalDate due, LocalDate returnedAt) {
        long days = ChronoUnit.DAYS.between(due, returnedAt);
        return Math.max(0, Math.min(5, days)) * 200;
    }
    static void check(long expected, long actual) {
        if (expected != actual) {
            throw new AssertionError("Expected " + expected + ", got " + actual);
        }
    }
    public static void main(String[] args) {
        LocalDate due = LocalDate.of(2026, 12, 31);
        check(0, fee(due, due));
        check(200, fee(due, due.plusDays(1)));
        check(1000, fee(due, due.plusDays(6)));
        System.out.println("3 checks passed");
    }
}`,
        notes: 'הבדיקות חוצות שנה בלי תלות בזמן ההרצה. נסה לשנות 5 ל-4: הבדיקה האחרונה תדווח שציפתה ל-1000.',
        pitfalls: [['בדיקות לא יציבות', 'בדיקה נכשלת רק בחצות.', 'שימוש ב-LocalDate.now בתוך החישוב.', 'העבר את התאריך לפרמטר.'], ['סימון שגיאה ללא כשל', 'הבדיקה מדפיסה תקלה אבל CI ירוק.', 'הבדיקה לא עוצרת עם כשל.', 'זרוק AssertionError או השתמש ב-JUnit.']],
        terms: [['Unit Test', 'בדיקה ממוקדת של יחידת התנהגות.'], ['LocalDate', 'תאריך ללא שעה וללא אזור זמן.'], ['Determinism', 'אותו קלט נותן אותה תוצאה.']],
        exercise: 'הוסף בדיקה להחזרה מוקדמת וליום המדויק שבו התקרה נכנסת לתוקף.',
        checks: ['יום לפני היעד מחזיר 0.', 'ימים 4, 5 ו-6 מחזירים 800, 1000 ו-1000.'],
        hints: ['`minusDays(1)` בונה תאריך מוקדם מהיעד.'],
        solution: 'הוסף `check(0, fee(due, due.minusDays(1)));`, `check(800, fee(due, due.plusDays(4)));` ו-`check(1000, fee(due, due.plusDays(5)));`; עדכן את ספירת הבדיקות בהודעה או הסר אותה.',
        quiz: [['למה להעביר את התאריך לפרמטר?', ['כדי לא להצטרך לולאה', 'כדי להפוך בדיקות לדטרמיניסטיות', 'כדי לאפשר ערכים שליליים'], 1, 'מתודה עם תאריך נתון אינה תלויה בשעון.'], ['איזה זוג מציב מבחן לגבול יום היעד?', ['יום היעד ויום אחריו', 'ימים 90 ו-91', 'שני מקרים זהים'], 0, 'זה הגבול בין פטור לחיוב.']],
      }),
    ],
  },
  {
    id: 'java-backend', number: 4, stage: 3, icon: 'server', tone: 'sky',
    title: 'Backend ופרויקט ספרייה', short: 'Backend ופרויקט', tagline: 'מפעולה אטומית לשירות HTTP מקומי, עם חוזה ובדיקת קצה לקצה.',
    why: 'שירות אמין מפריד בין קלט הרשת, הלוגיקה העסקית ואחסון הנתונים.',
    outcomes: ['למנוע מרוץ בכתיבה מקבילית', 'להגדיר ולבדוק חוזה HTTP', 'להריץ פרויקט משולב ולתכנן מעבר ל-SQL ול-Spring'],
    lessons: [
      workshop({
        id: 'l1', title: 'מקביליות: Virtual Threads ופעולה אטומית', summary: 'שתי בקשות מנסות להשאיל את אותו ספר ורק אחת מצליחה.', minutes: 50, level: 'advanced',
        intro: 'שני עובדים יכולים להסתכל על אותו מדף ולחשוב שהספר זמין. העובדה שרשימת המלאי בטוחה לשימוש במקביל לא הופכת רצף ״בדוק ואז עדכן״ לאטומי.',
        steps: [['Race', 'אם שתי משימות עושות `containsKey` ואז `put`, שתיהן עשויות לקבל אותה תשובת זמינות. הלולאה או מספר ה-threads אינם תיקון.'], ['Atomicity', '`ConcurrentHashMap.putIfAbsent` מחברת בדיקה והכנסה לפעולה אחת על אותו מפתח. ערך חזרה null פירושו שזו הבקשה הראשונה.'], ['Join', '`newVirtualThreadPerTaskExecutor` דורש JDK 21. שני `Future` מאפשרים להמתין לתוצאות; בודקים בדיוק הצלחה אחת בלי להניח מי מנצח.']],
        tradeoff: 'Virtual Threads מועילים כשמשימות ממתינות ל-I/O; הם אינם מגבילים גישה למסד. בפרודקשן מוסיפים קיבולת, deadlines וכלל ייחודיות במסד עבור כמה שרתים.',
        code: `
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) throws Exception {
        var loans = new ConcurrentHashMap<String, String>();
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            var first = executor.submit(() -> loans.putIfAbsent("b1", "Ada") == null);
            var second = executor.submit(() -> loans.putIfAbsent("b1", "Sam") == null);
            boolean a = first.get();
            boolean b = second.get();
            if (a == b) throw new AssertionError("Expected exactly one successful loan");
            System.out.println("One successful loan");
        }
    }
}`,
        notes: 'הסדר אינו חלק מחוזה הבדיקה. `get()` מחכה ויכול להעביר כשל משימה; חריגה אינה נחשבת להצלחה או הפסד במרוץ.',
        pitfalls: [['מרוץ', 'שתי הצלחות לאותו ספר.', 'בדיקה וכתיבה מתבצעות בנפרד.', 'חבר אותן לפעולה אטומית.'], ['תיקון מקומי בלבד', 'שני שרתים מאשרים השאלה.', 'לכל תהליך יש מפה משלו.', 'אכוף ייחודיות במסד משותף.']],
        terms: [['Race Condition', 'התוצאה תלויה בסדר לא מובטח בין פעולות.'], ['Atomic Operation', 'פעולה שנצפית כיחידה אחת.'], ['Virtual Thread', 'Thread קל שמנוהל על ידי ה-JVM.']],
        exercise: 'הוסף משימה שלישית שמשאילה ספר אחר. בדוק ששני ספרים שונים יכולים להישאל.',
        checks: ['בדיוק הצלחה אחת ל-b1.', 'יש הצלחה ל-b2 והמפה מכילה שני ערכים.'],
        hints: ['צור Future שלישי ובדוק אותו לפני סגירת ה-Executor.'],
        solution: 'הוסף `var third = executor.submit(() -> loans.putIfAbsent("b2", "Lee") == null);` ובדוק `if (!third.get() || loans.size() != 2) throw new AssertionError("Missing loan");`.',
        quiz: [['מה מונע שתי כתיבות לאותו מפתח?', ['Future.get', 'Virtual Threads', 'putIfAbsent'], 2, 'הבדיקה והכתיבה אטומיות באותה מפה.'], ['האם המפה שומרת בלעדיות בין שני תהליכים?', ['לא', 'כן תמיד', 'רק עבור b1'], 0, 'המפה שייכת לתהליך יחיד.']],
      }),
      workshop({
        id: 'l2', title: 'HTTP API מקומי עם Java', summary: 'בונים Endpoint בדיקה ומפרידים קוד סטטוס מגוף התשובה.', minutes: 50, level: 'advanced',
        intro: 'בקשת HTTP דומה לטופס עם יעד ושם פעולה. השרת צריך לענות במבנה שהלקוח יכול לפרש גם כשהבקשה אינה חוקית.',
        steps: [['Bind', 'האזן רק ל-127.0.0.1, פורט 8080. בהרצה מקומית השתמש ב-`java --add-modules jdk.httpserver Main.java`. עצור עם Ctrl+C.'], ['Route', 'ה-Context של HttpServer מתאים לפי תחילית, ולכן בדוק את הנתיב המדויק לפני בחירת שיטת HTTP.'], ['Response', 'קבע `Content-Type`, המר את הגוף ל-UTF-8 ומדוד אורך בבייטים. ל-405 הוסף `Allow`. סגור את ה-exchange גם בכשל.']],
        tradeoff: 'HttpServer מספיק ללימוד החוזה. באפליקציה גדולה Framework כמו Spring Boot מנהל Routing, Serialization, אימות ו-Lifecycle — החוזה נשאר אותו חוזה.',
        code: `
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class Main {
    public static void main(String[] args) throws Exception {
        var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 8080), 16);
        server.createContext("/", exchange -> {
            try (exchange) {
                int status = 200;
                String body = "ok";
                if (!exchange.getRequestURI().getPath().equals("/health")) {
                    status = 404;
                    body = "not found";
                } else if (!exchange.getRequestMethod().equals("GET")) {
                    status = 405;
                    body = "method not allowed";
                    exchange.getResponseHeaders().set("Allow", "GET");
                }
                byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
                exchange.sendResponseHeaders(status, bytes.length);
                exchange.getResponseBody().write(bytes);
            }
        });
        server.start();
    }
}`,
        notes: 'בטרמינל שני הרץ `curl -i http://127.0.0.1:8080/health`, `curl -i http://127.0.0.1:8080/health-check` ו-`curl -i -X POST http://127.0.0.1:8080/health`; צפה ב-200, 404 ו-405. ב-PowerShell ישן השתמש ב-`curl.exe`.',
        pitfalls: [['התאמה רחבה מדי', 'גם health-check מחזיר 200.', 'הקוד מסתפק ב-Context prefix.', 'השווה לנתיב המדויק.'], ['אורך גוף שגוי', 'תשובה עם עברית נחתכת.', 'נמדד מספר תווי Java ולא מספר בייטים.', 'מדוד אחרי הקידוד ל-UTF-8.']],
        terms: [['Endpoint', 'צירוף נתיב ושיטה בשירות HTTP.'], ['Status Code', 'מספר שמסווג את תוצאת הבקשה.'], ['Loopback', 'כתובת נגישה מהמחשב עצמו בלבד.']],
        exercise: 'הוסף GET /ready עם גוף ready, ושמור את התנהגות 404 ו-405.',
        checks: ['GET /ready מחזיר 200 ו-ready.', 'POST /ready מחזיר 405 עם Allow: GET.', 'GET /ready/extra מחזיר 404.'],
        hints: ['בדוק את שני הנתיבים החוקיים לפני בדיקת השיטה.'],
        solution: 'שמור `String path = exchange.getRequestURI().getPath();` ואתחול גוף `String body = path.equals("/ready") ? "ready" : "ok";`. תנאי ה-404 הוא `!path.equals("/health") && !path.equals("/ready")`.',
        quiz: [['מה הקוד עבור שיטה לא מורשית בנתיב קיים?', ['404', '405', '200'], 1, '405 מציין שהנתיב קיים אבל השיטה לא נתמכת.'], ['לפי מה מודדים Content-Length?', ['ביטים', 'תווים', 'בייטים'], 2, 'אורך הגוף נמדד אחרי קידוד בפועל.']],
      }),
      workshop({
        id: 'l3', title: 'פרויקט מסכם: Library Loans API', summary: 'מחברים אימות, החזרה, סטטוסים ופעולות אטומיות לשירות שלם.', minutes: 75, level: 'advanced',
        intro: 'דלפק ספרייה חייב למנוע השאלה כפולה, אך גם לדעת להחזיר ספר ולאפשר את ההשאלה הבאה. בונים גרסה מקומית ומסמנים בדיוק אילו הבטחות היא נותנת לפני שמחליפים את האחסון.',
        steps: [['Domain', 'יש ספר אחד, `b1`. `POST /loans/b1` משאיל ו-`DELETE /loans/b1` מחזיר. אי אפשר להשאיל שוב כל עוד הספר מושאל. החזרה ללא השאלה נותנת 404. אין זיהוי משתמשים בדוגמה המקומית.'], ['HTTP', 'הפרד את מרחב הנתיבים, השיטות והתוצאות. 201 מציין יצירה, 409 התנגשות, 200 החזרה. השתמש ב-Executor של Virtual Threads כדי לאפשר בקשות חופפות.'], ['Release', 'הרץ `java --add-modules jdk.httpserver Main.java`. בדוק POST → POST → DELETE → POST, וצפה ב-201 → 409 → 200 → 201. אחר כך שלח שתי בקשות חופפות מספרייה במצב פנוי וודא שקיבלת בדיוק 201 אחד.']],
        tradeoff: 'במערכת עם יותר מתהליך אחד, העבר את הכתיבה למסד עם אילוץ `PRIMARY KEY (book_id)` להשאלות פעילות והמר רק התנגשות רלוונטית ל-409. הוסף אימות משתמשים לפני פרסום. אפשר לממש את אותו חוזה ב-Spring Boot בלי לשנות את מבחני ה-HTTP.',
        code: `
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) throws Exception {
        var loans = ConcurrentHashMap.<String>newKeySet();
        var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 8080), 32);
        var workers = Executors.newVirtualThreadPerTaskExecutor();
        server.setExecutor(workers);
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            server.stop(2);
            workers.shutdown();
        }));
        server.createContext("/", exchange -> {
            try (exchange) {
                int status;
                String body;
                if (!exchange.getRequestURI().getPath().equals("/loans/b1")) {
                    status = 404; body = "unknown resource";
                } else {
                    switch (exchange.getRequestMethod()) {
                        case "POST" -> {
                            boolean created = loans.add("b1");
                            status = created ? 201 : 409;
                            body = created ? "loan created" : "book already on loan";
                            if (created) exchange.getResponseHeaders().set("Location", "/loans/b1");
                        }
                        case "DELETE" -> {
                            boolean removed = loans.remove("b1");
                            status = removed ? 200 : 404;
                            body = removed ? "returned" : "no active loan";
                        }
                        default -> {
                            status = 405; body = "method not allowed";
                            exchange.getResponseHeaders().set("Allow", "POST, DELETE");
                        }
                    }
                }
                byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
                exchange.sendResponseHeaders(status, bytes.length);
                exchange.getResponseBody().write(bytes);
            }
        });
        server.start();
    }
}`,
        notes: 'השתמש ב-`curl -i -X POST http://127.0.0.1:8080/loans/b1` ובפקודה מקבילה עם DELETE. `add` ו-`remove` מחזירות האם הערך באמת השתנה. הנתונים מתאפסים בהפעלה מחדש; לא לפרסם את גרסת המעבדה באינטרנט.',
        pitfalls: [['כפל השאלות', 'שתי בקשות מגיעות ל-201.', 'הכנסה מתבצעת אחרי בדיקה נפרדת.', 'הסתמך על ערך החזרה של add.'], ['הנחת Durability', 'ההשאלות נעלמות באתחול.', 'האחסון הוא בזיכרון.', 'שמור במסד עם כלל ייחודיות.']],
        terms: [['HTTP Contract', 'הנתיבים, השיטות והתוצאות שהלקוח רשאי להסתמך עליהם.'], ['409 Conflict', 'הבקשה מתנגשת במצב המשאב.'], ['Durability', 'יכולת הנתונים לשרוד סיום תהליך או כשל.']],
        exercise: 'תמוך גם ב-b2. הוסף בדיקת קבלה שמוכיחה שניתן להשאיל את שני הספרים בנפרד.',
        checks: ['POST ל-b1 ול-b2 מחזיר 201 במצב פנוי.', 'POST חוזר ל-b2 מחזיר 409.', 'DELETE ל-b1 לא משפיע על b2.', 'ספר שאינו בקטלוג מחזיר 404.'],
        hints: ['השתמש ב-Map מנתיב מלא למזהה, במקום לפצל מחרוזת בלי לבדוק אותה.', 'השתמש במזהה הנבחר בכל פעולה ובנתיב הנבחר בכותרת Location.'],
        solution: 'הגדר `Map.of("/loans/b1", "b1", "/loans/b2", "b2")`. קבל `path` ו-`bookId` מהבקשה. אם המזהה חסר החזר 404; אחרת החלף את `loans.add("b1")` ו-`loans.remove("b1")` בקריאות על `bookId`, ואת Location ב-`path`. הרץ את ארבע בדיקות הקבלה שלך משירות שאותחל.',
        quiz: [['מה קורה ל-POST נוסף אחרי השאלה מוצלחת, לפני DELETE?', ['201', '404', '409'], 2, 'הספר כבר מושאל ולכן מתקבלת התנגשות.'], ['מה יאכוף בלעדיות בין עותקים של השירות?', ['אילוץ ייחודיות במסד משותף', 'שינוי פורט', 'הוספת Virtual Threads בלבד'], 0, 'האילוץ משותף לכל הכותבים.']],
      }),
    ],
  },
];
