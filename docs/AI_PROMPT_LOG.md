# AI_PROMPT_LOG

## AI használat rövid leírása

A projekt készítése során ChatGPT-t használtam ötleteléshez, komponensstruktúra tervezéséhez, hibakereséshez és React kódrészletek finomításához.

---

## 1. prompt
**Kérés:**  
Segíts megtervezni egy műköröm időpontfoglaló React alkalmazás első mérföldkövét.

**AI válasz:**  
Javasolt oldalak, komponensek, routing és dokumentációs struktúra.

**Értékelés:**  
Elfogadtam, mert jól illeszkedett a kurzus követelményeihez. A projekt nevét és néhány oldalt a saját elképzelésemhez igazítottam.


## 2. prompt
**Kérés:**  
Adj példát React Router alapú többoldalas navigációra 4 route-tal és 404 oldallal.

**AI válasz:**  
BrowserRouter, Routes és Route alapú megoldás.

**Értékelés:**  
Elfogadtam, majd a route neveket magyar útvonalakra módosítottam.

---

## 3. prompt
**Kérés:**  
Segíts responsive navbar és design token rendszer kialakításában.

**AI válasz:**  
CSS custom properties, mobile-first struktúra, breakpointok és fókuszállapotok.

**Értékelés:**  
Nagyrészt elfogadtam, mert jól támogatta az 1. mérföldkő elvárásait. A színeket és szövegeket saját igényeimhez igazítottam.

---

## 4. prompt
**Kérés:**  
Segíts kapcsolatfelvételi oldalt készíteni Supabase mentéssel, inline validációval és admin nézettel a beérkezett üzenetek listázására.

**AI válasz:**  
Külön `contactMessageService` fájlt, validált kontakt űrlapot és admin lista nézetet javasolt.

**Értékelés:**  
Elfogadtam, de a megoldást módosítanom kellett, mert az adatbázis tényleges mezői (`phone`, `subject`) eltértek az első változattól. A hibákat a Supabase hibaüzenetei alapján javítottam.

---

## 5. prompt
**Kérés:**  
Segíts szerepkör alapú megjelenítést kialakítani React + Supabase környezetben úgy, hogy legyen visitor, client és admin nézet.

**AI válasz:**  
AuthContext alapú megoldást javasolt `authUser` és `dbUser` állapotokkal, valamint feltételes rendereléssel az oldalakban.

**Értékelés:**  
Jól jött a segítség, A jogosultsági logikát a saját users táblám role mezőjére építettem.

---

## 6. prompt
**Kérés:**  
Segíts React oldalakra szétbontani a korábbi nagy App.jsx logikát úgy, hogy a foglalások a BookingPage-re, a szolgáltatások a ServicesPage-re, az auth pedig külön AuthPage-re kerüljön.

**AI válasz:**  
Page-alapú szerkezetet, route bekötést és külön komponenslogikát javasolt.

**Értékelés:**  
Segített, mert javította a projekt átláthatóságát. Az importútvonalakat és a tényleges mappastruktúrát manuálisan ellenőriztem és javítottam.

---


## Problémák az AI-val

Egy ponton az AI által javasolt fájlstruktúra és importútvonalak nem egyeztek meg teljesen a tényleges projektstruktúrával, ezért az oldal fehéren jelent meg. A hibát a konzolüzenetek alapján ellenőriztem, majd a fájlokat a megfelelő mappákba helyeztem, és az importokat javítottam.

## Összegzés

Az AI használata jelentősen gyorsította a tervezést és a fejlesztést, de minden javaslatot ellenőriztem és a saját projektemhez igazítottam.

