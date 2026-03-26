# COMPONENTS

## Komponens alapú felépítés

A SlaySalon alkalmazás React alapú komponensarchitektúrát használ.  
A felület kisebb, újrahasznosítható komponensekre van bontva, amelyek együtt építik fel az egyes oldalakat.

---

## Fő layout komponensek

### Navbar
A felső navigációs sáv, amely minden oldalon megjelenik.

Funkciók:
- Navigáció a fő oldalak között (Kezdőlap, Szolgáltatások, Foglalás, Kapcsolat)
- Logó megjelenítése
- Reszponzív menü mobil nézetben

---

### Footer
Az oldal alján megjelenő komponens.

Funkciók:
- Elérhetőségi adatok
- Közösségi média linkek
- Copyright információk

---

## Oldal (page) komponensek

### HomePage
A kezdőoldal komponense.

Tartalom:
- Rövid bemutatkozás
- Kiemelt szolgáltatások
- Call-to-action (pl. "Foglalj időpontot")

---

### ServicesPage
A szolgáltatások listáját megjelenítő oldal.

Tartalom:
- Szolgáltatások listája
- Szolgáltatás kártyák (ServiceCard komponens)

---

### BookingPage
Az időpontfoglalás oldala.

Tartalom:
- Szolgáltatás kiválasztása
- Időpont kiválasztása
- Foglalási űrlap

---

### ContactPage
Kapcsolati oldal.

Tartalom:
- Kapcsolati űrlap
- Elérhetőségek megjelenítése

---

## Újrahasznosítható komponensek

### ServiceCard
Egy adott szolgáltatás megjelenítésére szolgáló kártya.

Tulajdonságok (props):
- name
- description
- price
- duration

---

### BookingForm
A foglalási folyamatot kezelő űrlap.

Funkciók:
- Adatbekérés (név, e-mail stb.)
- Szolgáltatás kiválasztása
- Időpont kiválasztása
- Validáció

---

### ContactForm
Kapcsolati űrlap komponens.

Funkciók:
- Név, e-mail, üzenet mezők
- Validáció
- Üzenet küldése

---

### Button
Általános újrahasznosítható gomb komponens.

Tulajdonságok:
- label
- onClick
- type

---

## Komponens kapcsolatok

- A Navbar és Footer minden oldalon megjelenik
- A ServicesPage több ServiceCard komponenst használ
- A BookingPage a BookingForm komponenst tartalmazza
- A ContactPage a ContactForm komponenst használja

---

## Összegzés

Az alkalmazás komponens alapú felépítése lehetővé teszi a kód újrahasznosítását, az egyszerű karbantartást és a skálázhatóságot.