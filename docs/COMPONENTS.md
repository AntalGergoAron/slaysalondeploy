# COMPONENTS

## Komponens alapú felépítés

A SlaySalon alkalmazás React alapú komponensarchitektúrát használ.  
A felület logikailag elkülönített layout, context, oldal (page) és service rétegekre épül.

A komponensszerkezet célja:
- az oldalak közötti közös elemek újrahasznosítása
- az egyes funkciók elkülönítése
- az egyszerűbb karbantartás és továbbfejleszthetőség

---

## Fő layout komponensek

### Layout
A teljes alkalmazás közös keretkomponense.

Funkciók:
- közös oldalszerkezet biztosítása
- `Navbar` megjelenítése
- az aktuális oldal betöltése `Outlet` segítségével
- fő tartalmi terület és footer megjelenítése

---

### Navbar
A felső navigációs sáv, amely minden oldalon megjelenik.

Funkciók:
- navigáció a fő oldalak között
- aktív útvonal vizuális kiemelése
- linkek a publikus és belső oldalakra
- reszponzív, mobile-first működés

Navigációs elemek:
- Kezdőlap
- Szolgáltatások
- Foglalás
- Kapcsolat
- Fiók

---

## Állapotkezelő komponens

### AuthProvider / AuthContext
A teljes alkalmazás hitelesítési és felhasználói állapotát kezeli.

Funkciók:
- Supabase auth session figyelése
- aktuális auth user tárolása
- a `public.users` táblából a hozzá tartozó user rekord betöltése
- bejelentkezés
- regisztráció
- kijelentkezés
- szerepkör alapú működés támogatása

Kezelt szerepkörök:
- visitor
- client
- admin

---

## Oldal (page) komponensek

### HomePage
A kezdőoldal komponense.

Tartalom:
- rövid bemutatkozás
- szolgáltatásajánló tartalom
- call-to-action elemek
- navigáció a fontos oldalakra

---

### ServicesPage
A szolgáltatások listáját megjelenítő oldal.

Funkciók:
- szolgáltatások lekérése a backendből
- szolgáltatások listázása
- név szerinti keresés
- kategória szerinti szűrés
- többféle rendezés
- admin esetén szolgáltatás létrehozása
- admin esetén szolgáltatás szerkesztése
- admin esetén szolgáltatás törlése

---

### BookingPage
Az időpontfoglalás oldala.

Funkciók:
- szolgáltatások lekérése
- elérhető időpontok lekérése
- új foglalás létrehozása
- saját foglalások listázása
- meglévő foglalás szerkesztése
- meglévő foglalás törlése
- admin esetén az összes foglalás megjelenítése

Megjegyzés:
- visitor felhasználó csak tájékoztató szöveget lát
- client csak saját foglalásait látja és kezeli
- admin az összes foglalást látja

---

### ContactPage
Kapcsolati oldal.

Funkciók:
- statikus elérhetőségek megjelenítése
- kapcsolatfelvételi űrlap
- validáció
- üzenet mentése a `contact_messages` táblába
- admin esetén a beérkezett üzenetek listázása

---

### AuthPage
A fiók kezelésére szolgáló oldal.

Funkciók:
- regisztráció
- bejelentkezés
- kijelentkezés
- aktuális felhasználói adatok megjelenítése
- szerepkör megjelenítése

---

### NotFoundPage
404-es oldal.

Funkció:
- nem létező útvonal esetén felhasználóbarát visszajelzés megjelenítése

---

## Service réteg

A backend kommunikáció külön service fájlokban van elkülönítve.

### appointmentService
Funkciók:
- foglalások lekérése
- foglalás létrehozása
- foglalás szerkesztése
- foglalás törlése

---

### serviceService
Funkciók:
- szolgáltatások lekérése
- szolgáltatás létrehozása
- szolgáltatás szerkesztése
- szolgáltatás törlése

---

### timeSlotService
Funkciók:
- időpontok lekérése
- időpont foglalttá tétele
- időpont ismét elérhetővé tétele

---

### contactMessageService
Funkciók:
- kapcsolatfelvételi üzenetek lekérése
- új üzenet mentése

---

## Komponens kapcsolatok

- A `Layout` minden oldal közös kerete
- A `Layout` tartalmazza a `Navbar` komponenst
- Az `AuthProvider` körbefogja a teljes alkalmazást
- A `ServicesPage`, `BookingPage`, `ContactPage` és `AuthPage` a contextből és service-ekből dolgoznak
- A React Router biztosítja az oldalak közötti navigációt

---

## Összegzés

Az alkalmazás komponens alapú felépítése biztosítja a logikai elkülönítést, a kód újrahasznosíthatóságát és a könnyebb fejleszthetőséget. Az oldalak külön felelősségi körök szerint működnek, míg a backend kommunikáció külön service rétegben van kezelve.