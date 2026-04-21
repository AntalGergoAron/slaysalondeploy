# SPECIFICATION

## Projekt leírás

A SlaySalon egy React + Vite alapú műköröm időpontfoglaló alkalmazás, amely lehetővé teszi a vendégek számára, hogy egyszerűen és gyorsan online időpontot foglaljanak egy műkörmös szalonba.

Az alkalmazás célja, hogy átlátható módon jelenítse meg:
- a szolgáltatásokat
- az elérhető időpontokat
- a meglévő foglalásokat
- a kapcsolattartási lehetőségeket

A rendszer többféle felhasználói nézetet támogat:
- látogató
- bejelentkezett ügyfél
- admin

---

## Technológiai háttér

### Frontend
- React
- Vite
- React Router

### Állapotkezelés
- React state
- React context (`AuthContext`)
- derived state `useMemo` segítségével

### Backend
- Supabase

### Backend kommunikáció
- külön service réteg:
  - `appointmentService`
  - `serviceService`
  - `timeSlotService`
  - `contactMessageService`

### Stíluskezelés
- CSS custom properties alapú design token rendszer
- mobile-first megközelítés

---

## Projekt célja

A projekt célja egy olyan többoldalas webalkalmazás létrehozása, amely:
- valós backenddel kommunikál
- perzisztensen tárolja az adatokat
- több entitást kezel
- támogatja a CRUD műveleteket
- felhasználói szerepköröket használ
- reszponzív és könnyen használható felületet biztosít

---

## Funkcionális követelmények

### 1. Szolgáltatások megjelenítése
A felhasználók megtekinthetik a szalon által kínált szolgáltatásokat.

Minden szolgáltatáshoz tartozhat:
- név
- leírás
- ár
- időtartam
- kategória
- aktív/inaktív állapot

A szolgáltatáslista támogatja:
- név szerinti keresést
- kategória szerinti szűrést
- rendezést

---

### 2. Időpontfoglalás
A bejelentkezett felhasználók kiválaszthatnak:
- egy szolgáltatást
- egy elérhető időpontot

A foglaláshoz megadják:
- nevüket
- email címüket
- telefonszámukat
- opcionális megjegyzésüket

A rendszer támogatja:
- foglalás létrehozását
- foglalás szerkesztését
- foglalás törlését

---

### 3. Kapcsolat oldal
A felhasználók megtekinthetik a szalon elérhetőségeit, például:
- címet
- telefonszámot
- email címet

A kapcsolat oldalon keresztül üzenetet is küldhetnek.

Az űrlap mezői:
- név
- email
- telefon
- tárgy
- üzenet

Az elküldött üzenetek a backendben kerülnek tárolásra.

---

### 4. Hitelesítés és fiókkezelés
A rendszer támogatja:
- regisztrációt
- bejelentkezést
- kijelentkezést

A bejelentkezett felhasználó a Fiók oldalon láthatja:
- email címét
- szerepkörét

---

### 5. Szerepkör alapú működés
A rendszer három logikai állapotot kezel:

#### Visitor
- böngészheti a nyilvános oldalakat
- nem hozhat létre foglalást

#### Client
- saját foglalásokat hozhat létre
- saját foglalásait láthatja, szerkesztheti és törölheti
- kapcsolatfelvételi űrlapot használhat

#### Admin
- az összes foglalást láthatja
- szolgáltatásokat hozhat létre, szerkeszthet és törölhet
- beérkezett kapcsolatfelvételi üzeneteket láthat

---

## Nem-funkcionális követelmények

### Reszponzivitás
Az alkalmazás mobile-first megközelítéssel készül.

A felület:
- mobilon
- tableten
- asztali nézetben is használható

---

### Felhasználói élmény
Az alkalmazás támogatja:
- loading állapotok megjelenítését
- hibaüzenetek megjelenítését
- sikeres műveletek visszajelzését
- üres állapotok megjelenítését
- validációs hibák jelzését

---

### Accessibility követelmények
Az alkalmazás figyel az alábbiakra:
- szemantikus HTML elemek használata
- billentyűzettel használható navigáció
- látható fókuszállapotok
- megfelelő kontraszt

---

## Oldalak

- `/` — Kezdőlap
- `/szolgaltatasok` — Szolgáltatások oldal
- `/foglalas` — Időpontfoglalás oldal
- `/kapcsolat` — Kapcsolat oldal
- `/fiok` — Bejelentkezés / regisztráció / fiók oldal
- `*` — 404 / Not Found oldal

---

## Navigáció

Az alkalmazás egy felső navigációs sávot tartalmaz, amelyről a felhasználó elérheti a fő oldalakat. Az aktuális oldal vizuálisan kiemelve jelenik meg.

A közös oldalkeretről a `Layout` komponens gondoskodik, amely minden route esetén megjeleníti a navigációt és a fő tartalmi területet.

---

## Összegzés

A SlaySalon egy modern, többoldalas, backenddel integrált React alkalmazás, amely a műköröm szalonok időpontfoglalási folyamatait támogatja.  
A rendszer perzisztens adattárolást, szerepkör alapú működést, több entitás kezelését és valós CRUD műveleteket biztosít.