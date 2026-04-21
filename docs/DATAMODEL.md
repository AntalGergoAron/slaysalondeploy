# DATAMODEL

## Adatmodell áttekintés

A SlaySalon alkalmazás célja, hogy kezelje:
- a felhasználókat
- a szolgáltatásokat
- az elérhető időpontokat
- a foglalásokat
- a kapcsolat oldalon küldött üzeneteket

Az adatmodell 5 fő entitásból áll:

- User
- Service
- TimeSlot
- Appointment
- ContactMessage

---

## 1. User

A rendszer felhasználóit reprezentálja.

### Attribútumok
- `id` (number) – egyedi azonosító a `public.users` táblában
- `auth_user_id` (uuid) – hivatkozás a Supabase auth felhasználóra
- `full_name` (string) – teljes név
- `email` (string) – e-mail cím
- `phone` (string) – telefonszám
- `role` (string) – felhasználói szerepkör (`client` vagy `admin`)
- `created_at` (datetime) – létrehozás ideje

### Megjegyzés
A frontend nézetben megjelenik egy harmadik logikai állapot is:
- `visitor` – nem bejelentkezett felhasználó

Ez nem külön adatbázis rekord, hanem a be nem jelentkezett állapot frontend oldali reprezentációja.

---

## 2. Service

A szalon által kínált szolgáltatásokat tárolja.

### Attribútumok
- `id` (number)
- `name` (string)
- `description` (string)
- `duration_minutes` (number)
- `price` (number)
- `category` (string)
- `is_active` (boolean)
- `created_at` (datetime)
- `updated_at` (datetime)

---

## 3. TimeSlot

Az elérhető foglalható időpontokat tárolja.

### Attribútumok
- `id` (number)
- `slot_date` (date)
- `start_time` (string)
- `end_time` (string)
- `is_available` (boolean)
- `created_at` (datetime)

---

## 4. Appointment

A vendégek által leadott foglalásokat tárolja.

### Attribútumok
- `id` (number)
- `user_id` (number) – hivatkozás a foglalást létrehozó felhasználóra
- `service_id` (number) – hivatkozás a kiválasztott szolgáltatásra
- `time_slot_id` (number) – hivatkozás a kiválasztott időpontra
- `customer_name` (string)
- `customer_email` (string)
- `customer_phone` (string)
- `notes` (string)
- `status` (string) – pl. `pending`, `confirmed`, `cancelled`
- `created_at` (datetime)

---

## 5. ContactMessage

A kapcsolat oldalon keresztül küldött üzeneteket tárolja.

### Attribútumok
- `id` (number)
- `name` (string)
- `email` (string)
- `phone` (string)
- `subject` (string)
- `message` (string)
- `created_at` (datetime)

---

## Entitások közötti kapcsolatok

### User – Appointment
Kapcsolat típusa: **1:N**

Magyarázat:
- egy felhasználó több foglalással is rendelkezhet
- minden foglalás pontosan egy felhasználóhoz tartozik

---

### Service – Appointment
Kapcsolat típusa: **1:N**

Magyarázat:
- egy szolgáltatás több foglalásban is szerepelhet
- minden foglalás pontosan egy szolgáltatáshoz tartozik

---

### TimeSlot – Appointment
Kapcsolat típusa: **1:1 logikai kapcsolat**

Magyarázat:
- egy időpont egyszerre csak egy foglaláshoz tartozhat
- ezt az alkalmazás az elérhetőség kezelésével biztosítja
- foglaláskor az időpont nem lesz többé választható

---

### Auth user – User
Kapcsolat típusa: **1:1**

Magyarázat:
- minden Supabase auth userhez tartozik egy rekord a `public.users` táblában
- ezt trigger alapú szinkronizáció biztosítja

---

## Összegzés

Az adatmodell a foglalási rendszer működéséhez szükséges fő üzleti entitásokat tartalmazza.  
A kapcsolatok lehetővé teszik:
- a felhasználók és foglalások összekapcsolását
- a szolgáltatások és időpontok hozzárendelését a foglalásokhoz
- a kapcsolat oldalon küldött üzenetek tárolását
- a szerepkör alapú működés támogatását