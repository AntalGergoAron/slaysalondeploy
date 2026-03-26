# DATAMODEL

## Adatmodell áttekintés

Az alkalmazás célja, hogy kezelje a műkörmös szalon szolgáltatásait, az elérhető időpontokat és a vendégek foglalásait.

Az adatmodell az alábbi fő entitásokból áll:

- User
- Service
- TimeSlot
- Appointment
- ContactMessage

---

## User

A rendszer felhasználóit reprezentálja.

Attribútumok:

id (number) – egyedi azonosító

fullName (string) – teljes név

email (string) – e-mail cím

phone (string) – telefonszám

role (string) – felhasználói szerepkör (guest vagy admin)

createdAt (datetime) – létrehozás ideje

---

## Service

A szalon által kínált szolgáltatásokat tárolja.

Attribútumok:

id (number)

name (string)

description (string)

price (number)

durationMinutes (number)

category (string)

isActive (boolean)

createdAt (datetime)

---

## TimeSlot

Az elérhető foglalható időpontokat tárolja.

Attribútumok:

id (number)

date (date)

startTime (string)

endTime (string)

isAvailable (boolean)

createdAt (datetime)

---

## Appointment

A vendégek által leadott foglalásokat tárolja.

Attribútumok:

id (number)

userId (number)

serviceId (number)

timeSlotId (number)

status (string) – pending / confirmed / cancelled

notes (string)

createdAt (datetime)

---

## ContactMessage

A kapcsolat oldalon keresztül küldött üzenetek.

Attribútumok:

id (number)

name (string)

email (string)

subject (string)

message (string)

createdAt (datetime)

---

## Entitások közötti kapcsolatok

User – Appointment

1:N kapcsolat

Egy felhasználóhoz több foglalás tartozhat.

---

Service – Appointment

1:N kapcsolat

Egy szolgáltatás több foglaláshoz is kapcsolódhat.

---

TimeSlot – Appointment

1:1 kapcsolat

Egy időpont egyszerre csak egy foglaláshoz tartozhat.

---

User (admin) – TimeSlot

1:N kapcsolat

Egy admin több időpontot hozhat létre.