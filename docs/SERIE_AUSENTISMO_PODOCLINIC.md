# Serie del blog: el ausentismo de PodoClinic, medido en público

Decidida el 2026-10-11. Un caso real, contado en varios posts: los recordatorios por
WhatsApp (coexistencia) de PodoClinic y si bajan o no el ausentismo. **Se publica el
resultado sea cual sea**: las definiciones van antes que los números.

## Calendario

| # | Post | Cuándo | Estado |
|---|---|---|---|
| 1 | «¿Cómo reducir los pacientes que no llegan a su cita?» — coexistencia, el caso y el anuncio de la serie | 2026-10-13 09:00 (programado en PukaPress) | ✅ escrito y programado |
| 2 | **Cómo medimos**: definiciones, punto de partida y la lección de no haber medido desde el día 1 | escribir el 2026-10-12; publicar cuando SistemaSalud despliegue el reagendamiento que conserva la cita | ⏳ |
| 3 | **Mes 2**: avance con datos completos y los ajustes hechos, sin conclusión | mes 2 | ⏳ |
| 4 | **Mes 3**: avance y ajustes, sin conclusión | mes 3 | ⏳ |
| 5 | **Conclusión, mes 4**, sea cual sea | mes 4 | ⏳ |

Los meses se cuentan desde que SistemaSalud registra bien los reagendamientos (post 2).
Cada avance cuenta también **los ajustes** que se hagan en el camino: cambios en los
recordatorios, en el registro o en el proceso del consultorio, con su fecha, para que el
lector sepa qué cambió entre una medición y la siguiente. Avances sin conclusión: con unas
150 citas al mes, recién el mes 4 alcanza para distinguir 21% de 15%.

Ritmo del blog: un post por semana, los martes a las 09:00 (hora de Ecuador).

## Post 2 — material

- **La lección:** los recordatorios salieron el 2026-09-26 sin línea base. De junio a agosto
  nadie marcaba la asistencia (citas VENCIDA) y reagendar editaba la misma cita. Hoy solo hay
  un mes confiable: desde el 1-sep, cuando entró el panel de citas pendientes.
- **Lo que reagendar escondía:** 133 movimientos sobre 89 citas desde el 4-ago (Cristina 97,
  Ana 33, el bot 3). 38 cambiaron de día el mismo día de la cita y 7 se movieron sobre citas
  ya pasadas. «No llegó y la movimos» no figuraba como ausencia en ningún lado.
- **Las definiciones** (alineadas con MGMA y las guías de práctica):
  - ausencia: no llegó y no avisó → ausentismo = ausencias / citas programadas;
  - cancelación tardía: avisó dentro del corte que fije la clínica;
  - reagendamiento con aviso: turno recuperado, se mide aparte;
  - tasa de llenado de turnos liberados.
- **El punto de partida medido** (SistemaSalud, solo lectura, 2026-10-11), sin canceladas:

  | Quincena | Ausentismo |
  |---|---|
  | 1–15 sep | 22,7% |
  | 16–30 sep (recordatorios desde el 26) | 21,1% |
  | 1–10 oct (8 citas abiertas) | 15,6%–18,9% |

  Antes (11–25 sep) 14,8% contra después (26 sep–10 oct) 21,0%: Fisher p = 0,48, no concluyente.
  Con y sin recordatorio, iguales: 20,9% contra 21,1%.
- **Recordatorios** (chatbot-python, 26 sep–11 oct): 53 enviados a 47 pacientes, 77%
  respondió, 22 confirmaron o reagendaron con el bot y 7 cambios de cita se supieron con
  anticipación.
- **Por qué hacen falta ~4 meses:** distinguir 21% de 15% exige unas 640 citas por grupo, y
  PodoClinic tiene unas 150 al mes.

## Dependencias

- **SistemaSalud** (sesión con agy, encargo del 2026-10-11): reagendar conserva la cita
  original con estado propio, enlazada a la nueva, con anticipación y origen (paciente, bot o
  consultorio), más un reporte mensual. Hay tres decisiones de Luis y Cristina pendientes: el
  corte de la cancelación tardía, si un cambio de «solo hora» el mismo día cuenta, y si se
  migran los 133 movimientos históricos.
- **Cristina:** confirmar que acepta que PodoClinic aparezca con nombre en toda la serie. Su
  permiso del 2026-10-11 cubre las cifras sin nombres de pacientes.

## Reglas que no cambian

- No escribir que los recordatorios reducen el ausentismo hasta que los datos lo muestren.
  Tampoco usar «redujo el ausentismo» de Cristina: los datos de octubre no lo respaldan.
- Recordatorios «a los pacientes que aceptan recibirlos»: PukaHealth todavía no registra el
  consentimiento.
- No citar cifras de proveedores («70% menos ausencias») sin un estudio detrás.
