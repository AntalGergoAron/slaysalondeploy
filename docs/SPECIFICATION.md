# SPECIFICATION

## Projekt leírás

A SlaySalon egy műköröm időpontfoglaló react alapú alkalmazás, amely lehetővé teszi a vendégek számára, hogy egyszerűen és gyorsan online időpontot foglaljanak egy műkörmös szalonba. Az alkalmazás célja, hogy átlátható módon jelenítse meg a szolgáltatásokat, az elérhető időpontokat és a kapcsolattartási információkat.

Az alkalmazás elsődleges célcsoportja a szalon vendégei, akik mobilról vagy asztali számítógépről szeretnének időpontot foglalni. Másodlagos felhasználó a szalon adminisztrátora vagy tulajdonosa, aki kezeli a foglalásokat és az elérhető időpontokat.

---

## Funkcionális követelmények

### Szolgáltatások megjelenítése
A felhasználók megtekinthetik a szalon által kínált műkörmös szolgáltatásokat. Minden szolgáltatáshoz tartozik név, rövid leírás, ár és várható időtartam.

### Időpontfoglalás
A vendégek kiválaszthatnak egy szolgáltatást, majd egy elérhető időpontot. A foglaláshoz meg kell adniuk nevüket, telefonszámukat és email címüket.

### Kapcsolat oldal
A felhasználók megtekinthetik a szalon elérhetőségeit, például címet, telefonszámot és nyitvatartást.

### Navigáció
Az alkalmazás több különböző oldalból áll, amelyek között kliens-oldali routing segítségével lehet navigálni.

---

## Nem-funkcionális követelmények

### Technológiai döntések

Frontend:
React

Build tool:
Vite

Routing:
React Router

Stíluskezelés:
CSS custom properties alapú design token rendszer

Backend:
A későbbi fejlesztési fázisban Node.js vagy Express alapú backend kapcsolható hozzá.

---

### UX követelmények

Az alkalmazás mobile-first megközelítéssel készül.

A felület reszponzív, mobil, tablet és desktop nézetben is megfelelően működik.

Az interaktív elemek érintőképernyőn is jól használhatók.

A felület egyszerű és könnyen átlátható.

---

### Accessibility követelmények

Szemantikus HTML elemek használata (header, nav, main, footer).

Billentyűzettel használható navigáció.

Látható fókuszállapotok.

Megfelelő kontraszt a szöveg és háttér között.

---

## Felhasználói szerepkörök

### Anonim látogató
Az anonim látogató bejelentkezés nélkül böngészheti az alkalmazás nyilvános részeit. Megtekintheti a szolgáltatásokat, a kezdőlap tartalmát és a kapcsolat oldalt, de foglalást nem hozhat létre.

### Vendég / felhasználó
A vendég felhasználó a rendszer aktív használója, aki szolgáltatást választhat és időpontfoglalást kezdeményezhet. A jelenlegi verzióban a foglalási folyamat egyszerűsített formában érhető el.

### Adminisztrátor
Az adminisztrátor a későbbi fejlesztési fázisban a szolgáltatások, időpontok és foglalások kezeléséért felel. Ez a szerepkör a rendszer tervezett bővítésének része.

## Oldalak

/ — Kezdőlap

/szolgaltatasok — Szolgáltatások oldal

/foglalas — Időpontfoglalás oldal

/kapcsolat — Kapcsolat oldal

* — 404 / Not Found oldal

---

## Navigáció

Az alkalmazás egy felső navigációs sávot tartalmaz, amelyről a felhasználó bármelyik főoldalt elérheti. Az aktuális oldal vizuálisan kiemelve jelenik meg a navigációban.