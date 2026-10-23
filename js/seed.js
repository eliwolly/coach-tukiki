/* Libreria base di esercizi Tukiki.
   Ogni esercizio ha: obiettivo, difficoltà (1 facile, 2 media, 3 difficile), durata, schema del campo
   e suggerimenti per renderlo più facile o più difficile, così ognuno partecipa a modo suo. */
(function () {
  // piccoli aiuti per scrivere gli schemi
  const A = (x, y, n) => ({ t: 'A', x, y, n });
  const B = (x, y, n) => ({ t: 'B', x, y, n });
  const J = (x, y) => ({ t: 'J', x, y, n: 'J' });
  const M = (x, y) => ({ t: 'M', x, y });
  const ball = (x, y) => ({ t: 'ball', x, y });
  const cone = (x, y) => ({ t: 'cone', x, y });
  const disc = (x, y) => ({ t: 'disc', x, y });
  const pole = (x, y) => ({ t: 'pole', x, y });
  const hoop = (x, y) => ({ t: 'hoop', x, y });
  const ladder = (x, y, r) => ({ t: 'ladder', x, y, r: r || 0 });
  const goal = (x, y, r) => ({ t: 'goal', x, y, r: r || 0 });
  const mini = (x, y, r) => ({ t: 'mini', x, y, r: r || 0 });
  const pass = (x1, y1, x2, y2) => ({ t: 'pass', x1, y1, x2, y2 });
  const run = (x1, y1, x2, y2) => ({ t: 'run', x1, y1, x2, y2 });
  const drib = (x1, y1, x2, y2) => ({ t: 'drib', x1, y1, x2, y2 });
  const shot = (x1, y1, x2, y2) => ({ t: 'shot', x1, y1, x2, y2 });
  const square = (x1, y1, x2, y2, f) => [f(x1, y1), f(x2, y1), f(x2, y2), f(x1, y2)];

  const E = [];
  const add = (o) => E.push(Object.assign({ authorName: 'Tukiki', base: true, createdAt: '2026-10-20T00:00:00Z' }, o));

  /* ---------------- RISCALDAMENTO ---------------- */
  add({
    id: 'base-semaforo', title: 'Il semaforo', goal: 'riscaldamento', difficulty: 1, duration: 10,
    players: 'Tutto il gruppo', equipment: '4 coni, 1 pallone a testa',
    description: 'Ognuno conduce la palla dentro il quadrato. Il mister mostra un colore e tutti seguono la regola.',
    steps: ['Verde: conduci la palla dove vuoi.', 'Giallo: vai piano, palla sempre vicina.', 'Rosso: fermati con il piede sopra la palla.', 'Cambia colore spesso, anche con cartoncini colorati.'],
    tips: 'Usa cartoncini colorati oltre alla voce: aiuta chi fa fatica con le parole. Festeggia chi si ferma subito.',
    easier: 'Senza palla, solo camminando e correndo.', harder: 'Aggiungi colori nuovi: blu = cambia piede, viola = tocca la palla con la suola.',
    diagram: { field: 'free', items: [...square(25, 10, 80, 58, cone), A(38, 22, 1), ball(40.5, 23.5), A(62, 20, 2), ball(64.5, 21.5), A(48, 40, 3), ball(50.5, 41.5), A(70, 46, 4), ball(72.5, 47.5), A(33, 48, 5), ball(35.5, 49.5), drib(38, 22, 48, 30), drib(62, 20, 70, 32), M(90, 34)] },
  });
  add({
    id: 'base-acchiapparella', title: 'Acchiapparella con la palla', goal: 'riscaldamento', difficulty: 1, duration: 10,
    players: '6-16', equipment: '4 coni, palloni, 2 casacche',
    description: 'Due cacciatori con la casacca provano a toccare i compagni. Chi tiene la palla in mano è salvo.',
    steps: ['Delimita un quadrato con i coni.', 'Due cacciatori, gli altri scappano.', 'Ci sono 2-3 palloni: chi ha la palla in mano non può essere preso.', 'Passatevi la palla con le mani per salvare chi è in pericolo.', 'Chi viene toccato diventa cacciatore.'],
    tips: 'Fa nascere aiuto reciproco: chiama per nome il compagno a cui passi la palla.',
    easier: 'Spazio più piccolo e un solo cacciatore che cammina.', harder: 'La palla si passa con i piedi e non con le mani.',
    diagram: { field: 'free', items: [...square(20, 8, 85, 60, cone), B(35, 30, 'C'), B(70, 40, 'C'), A(50, 18, 1), A(60, 28, 2), ball(62.5, 29.5), A(45, 48, 3), A(28, 52, 4), ball(30.5, 53.5), A(75, 15, 5), run(35, 30, 46, 22), run(70, 40, 62, 31), pass(60, 28, 46, 46)] },
  });
  add({
    id: 'base-coppie-movimento', title: 'Passaggi a coppie in movimento', goal: 'riscaldamento', difficulty: 2, duration: 10,
    players: 'A coppie', equipment: '1 pallone ogni 2, 4 coni',
    description: 'Le coppie si muovono liberamente nello spazio passandosi la palla senza scontrarsi con le altre.',
    steps: ['Ogni coppia ha un pallone.', 'Camminate e passatevi la palla a 4-5 passi di distanza.', 'Dopo il passaggio, spostati in uno spazio libero.', 'Al fischio cambia compagno.'],
    tips: 'Insegna ad alzare la testa prima di passare. Ricorda: chiama il nome del compagno.',
    easier: 'Coppie ferme, passaggi da vicino.', harder: 'Solo due tocchi, poi passaggio obbligatorio.',
    diagram: { field: 'free', items: [...square(18, 8, 87, 60, cone), A(30, 20, 1), A(45, 26, 2), ball(32.5, 21.5), pass(30, 20, 43, 25), B(60, 16, 1), B(72, 26, 2), ball(73, 28.5), pass(72, 26, 62, 18), A(35, 46, 3), A(52, 50, 4), run(52, 50, 58, 44), J(70, 48)] },
  });

  /* ---------------- COORDINAZIONE ---------------- */
  add({
    id: 'base-percorso-coord', title: 'Percorso: scaletta, cerchi e paletti', goal: 'coordinazione', difficulty: 1, duration: 15,
    players: 'Tutto il gruppo, in fila', equipment: '1 scaletta, 4 cerchi, 5 paletti, 1 porta, palloni',
    description: 'Un percorso a stazioni per piedi veloci e equilibrio, che finisce con un tiro in porta.',
    steps: ['Scaletta: un piede in ogni spazio.', 'Cerchi: salta a piedi uniti da un cerchio all\'altro.', 'Paletti: slalom di corsa.', 'Alla fine prendi la palla e tira in porta.', 'Torna in fila camminando dal lato.'],
    tips: 'Mostra tu ogni stazione prima di iniziare. Un volontario accanto alla scaletta aiuta chi ha paura di inciampare.',
    easier: 'Cammina il percorso senza fretta. Togli il tiro.', harder: 'Gara a squadre a staffetta con il tempo.',
    diagram: { field: 'free', items: [A(8, 34, 1), A(5, 40, 2), ladder(20, 34, 90), hoop(34, 30), hoop(39, 38), hoop(44, 30), hoop(49, 38), pole(58, 28), pole(63, 38), pole(68, 28), pole(73, 38), pole(78, 28), ball(85, 34), goal(101, 34, 180), run(10, 34, 26, 34), run(80, 30, 84, 33), shot(87, 34, 99, 34)] },
  });
  add({
    id: 'base-specchio', title: 'Lo specchio', goal: 'coordinazione', difficulty: 1, duration: 8,
    players: 'A coppie', equipment: 'Cinesini',
    description: 'Uno guida e l\'altro copia i movimenti come uno specchio. Poi si scambiano.',
    steps: ['Le coppie si mettono una di fronte all\'altra, tra due cinesini.', 'Chi guida si muove a destra e sinistra, salta, si abbassa.', 'Il compagno copia esattamente.', 'Dopo 1 minuto si cambia.'],
    tips: 'Ottimo per l\'attenzione e per creare relazione. Si può fare anche con la palla tra le mani.',
    easier: 'Movimenti lenti e solo a destra e sinistra.', harder: 'Chi guida ha la palla ai piedi e il compagno deve copiare conducendo.',
    diagram: { field: 'free', items: [disc(25, 20), disc(45, 20), A(35, 16, 1), B(35, 25, 1), run(35, 16, 42, 16), disc(60, 20), disc(80, 20), A(70, 16, 2), B(70, 25, 2), disc(25, 46), disc(45, 46), A(35, 42, 3), B(35, 51, 3), disc(60, 46), disc(80, 46), A(70, 42, 4), B(70, 51, 4), run(70, 51, 77, 51)] },
  });
  add({
    id: 'base-numeri-cerchi', title: 'I cerchi dei numeri', goal: 'coordinazione', difficulty: 2, duration: 10,
    players: '4-12', equipment: '6 cerchi, palloni',
    description: 'Il mister chiama un numero o un colore e i giocatori corrono al cerchio giusto.',
    steps: ['Metti a terra 6 cerchi numerati da 1 a 6 (o colorati).', 'I giocatori corrono liberi intorno.', 'Al numero chiamato, tutti corrono dentro quel cerchio.', 'Poi chiama due numeri di fila: prima uno, poi l\'altro.'],
    tips: 'Allena attenzione e memoria. Usa le dita o cartelli con i numeri per chi non sente bene.',
    easier: 'Usa i colori invece dei numeri e un solo comando alla volta.', harder: 'Fallo con la palla al piede.',
    diagram: { field: 'free', items: [hoop(30, 20), hoop(52, 16), hoop(74, 20), hoop(30, 48), hoop(52, 52), hoop(74, 48), A(45, 32, 1), A(60, 36, 2), A(40, 40, 3), run(60, 36, 72, 23), run(45, 32, 32, 22), M(92, 34)] },
  });

  /* ---------------- CONDUZIONE ---------------- */
  add({
    id: 'base-slalom', title: 'Slalom tra i coni', goal: 'conduzione', difficulty: 1, duration: 10,
    players: '2-4 file', equipment: '6 coni per fila, 1 pallone a testa',
    description: 'Conduci la palla tra i coni senza toccarli, poi torna dritto al via.',
    steps: ['Metti 6 coni in fila a 2 passi uno dall\'altro.', 'Conduci la palla a zig zag tra i coni.', 'Arrivato in fondo, torna dritto conducendo.', 'Dai il cinque al compagno che parte.'],
    tips: 'Tocchi piccoli, palla vicina al piede. Usa interno ed esterno del piede.',
    easier: 'Coni più distanti, si può anche camminare.', harder: 'Solo piede debole, o con il tempo.',
    diagram: { field: 'free', items: [A(10, 22, 1), ball(13, 23), A(6, 22, 2), cone(22, 22), cone(32, 22), cone(42, 22), cone(52, 22), cone(62, 22), cone(72, 22), drib(14, 22, 27, 18), drib(27, 18, 37, 26), drib(37, 26, 47, 18), B(10, 46, 1), ball(13, 47), B(6, 46, 2), cone(22, 46), cone(32, 46), cone(42, 46), cone(52, 46), cone(62, 46), cone(72, 46), drib(14, 46, 27, 42)] },
  });
  add({
    id: 'base-porte-colorate', title: 'Le porte colorate', goal: 'conduzione', difficulty: 1, duration: 10,
    players: 'Tutto il gruppo', equipment: '16 coni (8 porticine), 1 pallone a testa',
    description: 'Tante porticine sparse nel campo: in un minuto attraversa con la palla più porte possibili.',
    steps: ['Crea 8 porticine con 2 coni ciascuna.', 'Ognuno conduce e passa dentro le porte.', 'Conta ad alta voce le porte attraversate.', 'Non si passa due volte di fila nella stessa porta.'],
    tips: 'Ognuno gioca contro sé stesso: celebra chi migliora il suo numero, non chi vince.',
    easier: 'Porte più larghe, tempo più lungo.', harder: 'Dopo ogni porta cambia direzione con la suola.',
    diagram: { field: 'free', items: [cone(20, 15), cone(26, 15), cone(45, 12), cone(45, 18), cone(70, 14), cone(76, 14), cone(30, 34), cone(30, 40), cone(56, 34), cone(62, 34), cone(84, 32), cone(84, 38), cone(22, 54), cone(28, 54), cone(60, 52), cone(60, 58), A(36, 24, 1), ball(38.5, 25.5), drib(36, 24, 52, 15), A(70, 44, 2), ball(72.5, 45.5), drib(70, 44, 60, 37), A(16, 44, 3), ball(18.5, 45.5)] },
  });
  add({
    id: 'base-cambio-direzione', title: 'Cambio di direzione al fischio', goal: 'conduzione', difficulty: 2, duration: 10,
    players: 'Tutto il gruppo', equipment: '4 coni, 1 pallone a testa',
    description: 'Si conduce nel quadrato. Al fischio si cambia direzione con la suola, l\'interno o l\'esterno.',
    steps: ['Tutti conducono liberi nel quadrato.', 'Un fischio: ferma la palla con la suola e riparti dall\'altra parte.', 'Due fischi: cambia direzione con l\'interno del piede.', 'Alza la testa per non scontrarti.'],
    tips: 'Mostra il gesto lentamente. Rinforza con "bravo!" ogni cambio riuscito.',
    easier: 'Solo un tipo di cambio: la suola.', harder: 'Il mister alza una mano: chi la vede per primo grida "mano!".',
    diagram: { field: 'free', items: [...square(22, 8, 83, 60, cone), A(35, 22, 1), ball(38, 23), drib(38, 23, 50, 23), drib(50, 23, 42, 30), A(64, 40, 2), ball(66.5, 41.5), drib(66.5, 41.5, 72, 30), A(40, 48, 3), ball(42.5, 49.5), A(70, 18, 4), ball(72.5, 19.5), M(94, 34)] },
  });
  add({
    id: 'base-staffetta', title: 'Staffetta con la palla', goal: 'conduzione', difficulty: 1, duration: 10,
    players: '2-4 squadre', equipment: '1 cono per squadra, 1 pallone per squadra',
    description: 'A turno, conduci la palla fino al cono, giraci intorno e torna a passarla al compagno.',
    steps: ['Squadre in fila dietro a un cinesino.', 'Il primo conduce fino al cono e lo gira.', 'Torna e passa la palla al compagno.', 'Vince la squadra che fa per prima tutti i giri, ma conta anche il tifo!'],
    tips: 'Mescola le squadre in modo che siano equilibrate. Tutti tifano per tutti.',
    easier: 'Cono più vicino, si può portare la palla in mano.', harder: 'Slalom all\'andata e conduzione col piede debole al ritorno.',
    diagram: { field: 'free', items: [disc(14, 18), A(10, 18, 1), A(6, 18, 2), A(2, 18, 3), ball(17, 18), cone(70, 18), drib(17, 18, 67, 18), B(10, 34, 1), B(6, 34, 2), B(2, 34, 3), disc(14, 34), cone(70, 34), A(10, 50, 4), A(6, 50, 5), A(2, 50, 6), disc(14, 50), cone(70, 50), drib(70, 52, 20, 52)] },
  });

  /* ---------------- PASSAGGIO ---------------- */
  add({
    id: 'base-passaggio-coppie', title: 'Passaggio a coppie', goal: 'passaggio', difficulty: 1, duration: 10,
    players: 'A coppie', equipment: '1 pallone ogni 2, cinesini',
    description: 'Due compagni uno di fronte all\'altro si passano la palla con l\'interno del piede.',
    steps: ['Mettetevi a 5-6 passi, ognuno dietro al suo cinesino.', 'Passa con l\'interno del piede.', 'Il compagno ferma la palla e la ripassa.', 'Contate insieme quanti passaggi riuscite a fare.'],
    tips: 'Piede d\'appoggio accanto alla palla, guarda il compagno. Chiama il suo nome prima di passare.',
    easier: 'Più vicini, si può fermare la palla con le mani.', harder: 'Passaggio di prima, senza fermare la palla.',
    diagram: { field: 'free', items: [disc(25, 14), disc(55, 14), A(22, 14, 1), A(58, 14, 2), ball(28, 14), pass(28, 14, 54, 14), disc(25, 34), disc(55, 34), B(22, 34, 1), B(58, 34, 2), ball(52, 34), pass(52, 34, 27, 34), disc(25, 54), disc(55, 54), A(22, 54, 3), A(58, 54, 4), ball(28, 54)] },
  });
  add({
    id: 'base-porticina', title: 'Passa nella porticina', goal: 'passaggio', difficulty: 1, duration: 10,
    players: 'A coppie', equipment: '2 coni e 1 pallone per coppia',
    description: 'Come il passaggio a coppie, ma la palla deve passare in mezzo a due coni.',
    steps: ['Metti due coni a metà tra i compagni, larghi 2 passi.', 'Passa la palla in mezzo ai coni.', 'Un punto per ogni passaggio riuscito.', 'Quando è facile, stringi la porticina.'],
    tips: 'Precisione prima della forza. Celebra i passaggi precisi.',
    easier: 'Porticina larga e distanza corta.', harder: 'Porticina stretta, piede debole.',
    diagram: { field: 'free', items: [A(18, 22, 1), A(70, 22, 2), ball(21, 22), cone(44, 18), cone(44, 26), pass(21, 22, 68, 22), B(18, 46, 1), B(70, 46, 2), ball(67, 46), cone(44, 43), cone(44, 49), pass(67, 46, 21, 46)] },
  });
  add({
    id: 'base-cerchio-nomi', title: 'Il cerchio dei nomi', goal: 'passaggio', difficulty: 1, duration: 8,
    players: '6-12', equipment: '1-2 palloni',
    description: 'In cerchio, si chiama il nome di un compagno e gli si passa la palla.',
    steps: ['Tutti in cerchio.', 'Chi ha la palla chiama un nome e passa a quella persona.', 'Chi riceve ringrazia, chiama un altro nome e passa.', 'Dopo un po\' aggiungi una seconda palla.'],
    tips: 'Perfetto a inizio allenamento e con giocatori nuovi: tutti si sentono chiamati.',
    easier: 'Passaggi con le mani.', harder: 'Dopo il passaggio, cambia posto con chi ha ricevuto.',
    diagram: { field: 'free', items: [A(52, 12, 1), A(70, 18, 2), A(76, 34, 3), A(70, 50, 4), A(52, 56, 5), A(34, 50, 6), A(28, 34, 7), A(34, 18, 8), ball(55, 14), pass(54, 14, 73, 48), pass(70, 18, 32, 33), M(52, 34)] },
  });
  add({
    id: 'base-triangolo', title: 'Passa e segui nel triangolo', goal: 'passaggio', difficulty: 2, duration: 12,
    players: '6-9 per triangolo', equipment: '3 coni, 1-2 palloni',
    description: 'Tre file ai vertici di un triangolo: passa al compagno e corri dietro alla sua fila.',
    steps: ['Metti 3 coni a triangolo, a 8 passi uno dall\'altro.', 'Una fila dietro ogni cono.', 'Passa alla fila successiva e corri a metterti in fondo a quella fila.', 'Dopo qualche minuto cambia senso.'],
    tips: '"Passa e segui" aiuta a ricordare dove andare. Indica la direzione con il braccio.',
    easier: 'Fermare la palla prima di passare, triangolo più piccolo.', harder: 'Due palloni contemporaneamente, passaggio di prima.',
    diagram: { field: 'free', items: [cone(30, 52), cone(75, 52), cone(52, 14), A(27, 55, 1), A(24, 58, 2), A(78, 55, 3), A(81, 58, 4), A(52, 10, 5), A(52, 6, 6), ball(32, 50), pass(32, 50, 50, 17), run(30, 50, 48, 13), pass(55, 16, 73, 49)] },
  });
  add({
    id: 'base-quadrato-passaggi', title: 'Il quadrato dei passaggi', goal: 'passaggio', difficulty: 2, duration: 12,
    players: '8-12', equipment: '4 coni, 2 palloni',
    description: 'File ai quattro angoli di un quadrato. Si passa lungo il lato e si segue la palla.',
    steps: ['Quadrato di 10 passi di lato, una fila per angolo.', 'Passa alla fila alla tua destra e seguila.', 'Chi riceve controlla con un tocco e passa.', 'Al fischio si cambia direzione.'],
    tips: 'Insegna a ricevere con il piede lontano dal passaggio, già orientati verso il prossimo compagno.',
    easier: 'Una sola palla, più tocchi liberi.', harder: 'Due palloni che partono da angoli opposti.',
    diagram: { field: 'free', items: [...square(30, 12, 75, 56, cone), A(27, 9, 1), A(78, 9, 2), A(78, 59, 3), A(27, 59, 4), ball(33, 12), pass(33, 12, 72, 12), run(30, 9, 72, 7), pass(75, 15, 75, 53), ball(75, 15)] },
  });
  add({
    id: 'base-torello', title: 'Torello 4 contro 1', goal: 'passaggio', difficulty: 2, duration: 12,
    players: '5 per gruppo', equipment: '4 coni, 1 pallone',
    description: 'Quattro giocatori in un quadrato si passano la palla, uno in mezzo prova a rubarla.',
    steps: ['Quadrato di 8 passi, 4 giocatori sui lati e 1 in mezzo.', 'Quelli fuori si passano la palla.', 'Se il giocatore in mezzo tocca la palla, cambia con chi ha sbagliato.', 'Contate i passaggi di fila.'],
    tips: 'Chi è in mezzo cambia spesso, così nessuno resta lì troppo a lungo.',
    easier: '5 contro 1 o quadrato più grande.', harder: 'Massimo due tocchi, oppure 4 contro 2.',
    diagram: { field: 'free', items: [...square(32, 12, 72, 56, cone), A(52, 12, 1), A(72, 34, 2), A(52, 56, 3), A(32, 34, 4), B(50, 32, 1), ball(54, 14), pass(54, 14, 70, 32), pass(70, 36, 54, 54), run(50, 32, 60, 40)] },
  });

  /* ---------------- TIRO ---------------- */
  add({
    id: 'base-tiro-fermo', title: 'Tiro da fermo', goal: 'tiro', difficulty: 1, duration: 10,
    players: 'In fila', equipment: '1 porta, palloni, cinesini',
    description: 'Tiro in porta con la palla ferma da diverse distanze.',
    steps: ['Metti 3 cinesini a distanze diverse dalla porta.', 'A turno si tira dal cinesino più vicino.', 'Chi segna può provare da più lontano.', 'Si recupera la palla e si torna in fila.'],
    tips: 'Ognuno sceglie la sua distanza: ogni gol è una festa.',
    easier: 'Porta senza portiere, distanza molto corta.', harder: 'Tiro negli angoli, segnati con due coni.',
    diagram: { field: 'half', items: [disc(84, 34), disc(76, 34), disc(68, 34), ball(76, 34), A(73, 34, 1), A(60, 34, 2), A(57, 34, 3), shot(77, 34, 101, 31), B(101, 34, 'P')] },
  });
  add({
    id: 'base-birilli', title: 'Abbatti i coni', goal: 'tiro', difficulty: 1, duration: 10,
    players: '2 squadre', equipment: '10 coni, palloni',
    description: 'Due squadre tirano la palla per abbattere i coni messi su una linea in mezzo.',
    steps: ['Metti 10 coni su una linea al centro.', 'Le squadre stanno dietro la loro linea, a 8 passi.', 'Tirate per far cadere i coni.', 'Quando sono tutti giù si contano: vince chi ne ha fatti cadere di più.'],
    tips: 'Si tira tanto e senza paura di sbagliare: ottimo per chi è timido davanti alla porta.',
    easier: 'Linea di tiro più vicina.', harder: 'Solo tiri di collo piede, o col piede debole.',
    diagram: { field: 'free', items: [cone(52, 10), cone(52, 16), cone(52, 22), cone(52, 28), cone(52, 34), cone(52, 40), cone(52, 46), cone(52, 52), cone(52, 58), A(22, 18, 1), A(22, 34, 2), A(22, 50, 3), ball(25, 34), shot(26, 34, 50, 28), B(82, 18, 1), B(82, 34, 2), B(82, 50, 3), ball(79, 50), shot(78, 50, 54, 46)] },
  });
  add({
    id: 'base-conduzione-tiro', title: 'Conduci e tira', goal: 'tiro', difficulty: 2, duration: 12,
    players: 'In fila', equipment: '1 porta, 4 coni, palloni',
    description: 'Conduci la palla in slalom e, superato l\'ultimo cono, tira in porta.',
    steps: ['4 coni in fila verso la porta.', 'Slalom conducendo la palla.', 'Dopo l\'ultimo cono, tira.', 'Recupera la palla e torna dal lato.'],
    tips: 'Prima di tirare, guarda la porta. Tiro di interno per la precisione.',
    easier: 'Niente slalom, solo conduzione dritta.', harder: 'Un difensore passivo parte dal lato.',
    diagram: { field: 'half', items: [A(42, 34, 1), A(38, 34, 2), ball(45, 34), cone(52, 34), cone(58, 34), cone(64, 34), cone(70, 34), drib(46, 34, 55, 30), drib(55, 30, 61, 38), drib(61, 38, 72, 36), shot(76, 35, 101, 31), B(101, 34, 'P')] },
  });
  add({
    id: 'base-uno-due-tiro', title: 'Uno-due e tiro', goal: 'tiro', difficulty: 3, duration: 15,
    players: '6-12', equipment: '1 porta, 2 cinesini, palloni',
    description: 'Passa al compagno appoggio, ricevi il passaggio di ritorno e tira al volo o dopo un controllo.',
    steps: ['Un compagno fa da appoggio al limite dell\'area.', 'Passa all\'appoggio e scatta in avanti.', 'L\'appoggio ti ridà la palla in corsa.', 'Tira in porta. Poi diventi tu l\'appoggio.'],
    tips: 'Il tempismo è tutto: scatta appena la palla parte.',
    easier: 'L\'appoggio ferma la palla e la ripassa con calma.', harder: 'Tiro di prima, senza controllo.',
    diagram: { field: 'half', items: [A(50, 44, 1), A(47, 47, 2), ball(53, 44), A(70, 30, 3), pass(53, 44, 68, 32), run(52, 44, 72, 42), pass(71, 32, 73, 40), shot(75, 41, 101, 36), B(101, 34, 'P')] },
  });

  /* ---------------- DRIBBLING E 1 CONTRO 1 ---------------- */
  add({
    id: 'base-ruba-coda', title: 'Ruba la coda', goal: 'dribbling', difficulty: 1, duration: 10,
    players: 'Tutto il gruppo', equipment: '1 casacca e 1 pallone a testa, 4 coni',
    description: 'Ognuno conduce la palla con una casacca nei pantaloncini come coda. Ruba le code degli altri!',
    steps: ['Ognuno mette una casacca dietro, nei pantaloncini.', 'Tutti conducono la palla nel quadrato.', 'Prova a rubare le code degli altri senza perdere la palla.', 'Chi perde la coda continua a giocare: non si esce mai!'],
    tips: 'Insegna a proteggere la palla con il corpo. Nessuno viene eliminato.',
    easier: 'Senza palla.', harder: 'Chi perde la palla deve fare un giro intorno al quadrato.',
    diagram: { field: 'free', items: [...square(22, 8, 83, 60, cone), A(35, 20, 1), ball(37.5, 21.5), B(48, 24, 1), ball(50.5, 25.5), A(64, 36, 2), ball(66.5, 37.5), B(42, 44, 2), ball(44.5, 45.5), A(70, 18, 3), ball(72.5, 19.5), run(48, 24, 38, 21), drib(64, 36, 54, 46)] },
  });
  add({
    id: 'base-1v1-porticine', title: '1 contro 1 verso le porticine', goal: 'dribbling', difficulty: 2, duration: 12,
    players: 'A coppie', equipment: '2 porticine (o 4 coni), palloni',
    description: 'Uno contro uno: chi ha la palla prova a segnare nella porticina del compagno.',
    steps: ['Campo piccolo con una porticina per lato.', 'Il mister passa la palla a uno dei due.', 'Chi ha la palla attacca, l\'altro difende.', 'Dopo un gol o un minuto, entra una nuova coppia.'],
    tips: 'Incoraggia a provare una finta. Sbagliare va benissimo.',
    easier: 'Il difensore è "di gomma": cammina e non tocca.', harder: 'Porticine più strette, si segna solo conducendo la palla dentro.',
    diagram: { field: 'free', items: [mini(28, 34, 0), mini(78, 34, 180), cone(28, 16), cone(78, 16), cone(28, 52), cone(78, 52), A(44, 32, 1), ball(47, 33), B(60, 36, 1), drib(47, 33, 56, 26), drib(56, 26, 74, 33), M(52, 60)] },
  });
  add({
    id: 'base-1v1-portiere', title: '1 contro 1 con il portiere', goal: 'dribbling', difficulty: 3, duration: 15,
    players: '6-12', equipment: '1 porta, palloni, 2 cinesini',
    description: 'L\'attaccante parte da centrocampo contro un difensore e prova a tirare in porta.',
    steps: ['Attaccanti in fila al centro, difensori in fila di lato.', 'Il mister passa all\'attaccante: parte il difensore.', 'L\'attaccante prova a superarlo e tirare.', 'Poi si cambiano i ruoli.'],
    tips: 'Attacca il difensore con decisione, poi cambia direzione.',
    easier: 'Il difensore parte più tardi.', harder: 'Il difensore parte di fronte all\'attaccante.',
    diagram: { field: 'half', items: [A(30, 34, 1), A(26, 34, 2), ball(34, 34), B(50, 56, 1), B(46, 58, 2), drib(34, 34, 62, 30), run(50, 56, 62, 40), shot(76, 32, 101, 36), B(101, 34, 'P'), M(40, 12)] },
  });

  /* ---------------- TATTICA ---------------- */
  add({
    id: 'base-2v1', title: '2 contro 1 in avanti', goal: 'tattica', difficulty: 2, duration: 15,
    players: '6-12', equipment: '1 porta, coni, palloni',
    description: 'Due attaccanti contro un difensore: impariamo quando passare e quando tirare.',
    steps: ['Due attaccanti partono insieme con una palla.', 'Un difensore li aspetta in area.', 'Se il difensore va sul compagno con la palla, passala all\'altro.', 'Concludete in porta.'],
    tips: 'Domanda semplice da ripetere: "il difensore è su di te? Passa!"',
    easier: 'Il difensore resta fermo su una linea.', harder: '3 contro 2 con un difensore che rientra.',
    diagram: { field: 'half', items: [A(40, 26, 1), A(40, 44, 2), ball(43, 26), B(70, 34, 1), drib(43, 26, 60, 26), run(40, 44, 70, 48), pass(62, 27, 72, 46), shot(75, 46, 101, 37), B(101, 34, 'P')] },
  });
  add({
    id: 'base-4-porte', title: 'Partita a 4 porte', goal: 'tattica', difficulty: 2, duration: 15,
    players: '6-10', equipment: '4 porticine, casacche, 1 pallone',
    description: 'Ogni squadra difende due porticine e attacca le altre due: si impara a cambiare lato.',
    steps: ['Metti due porticine per lato, vicino agli angoli.', 'Squadre con casacche di due colori.', 'Si segna in una delle due porte avversarie.', 'Se una porta è chiusa, cambia gioco verso l\'altra.'],
    tips: 'Insegna a guardare dove c\'è spazio libero.', easier: 'Porte più larghe, si segna anche colpendo i coni.',
    harder: 'Gol valido solo dopo 3 passaggi.',
    diagram: { field: 'free', items: [mini(8, 16, 0), mini(8, 52, 0), mini(97, 16, 180), mini(97, 52, 180), A(30, 22, 1), A(40, 44, 2), A(55, 30, 3), ball(58, 31), B(70, 24, 1), B(66, 42, 2), B(46, 34, 3), pass(58, 31, 80, 48), run(40, 44, 75, 52)] },
  });
  add({
    id: 'base-possesso-jolly', title: 'Possesso palla 4 contro 4 + jolly', goal: 'tattica', difficulty: 3, duration: 15,
    players: '9', equipment: '4 coni, casacche, 1 pallone',
    description: 'Due squadre si contendono la palla. Il jolly gioca sempre con chi ha la palla.',
    steps: ['Quadrato di 20 passi.', 'Squadra con la palla + jolly = 5 contro 4.', 'Obiettivo: fare 5 passaggi di fila = 1 punto.', 'Chi ruba la palla diventa la squadra in possesso.'],
    tips: 'Smarcarsi vuol dire andare dove il compagno ti vede. Muoviti dopo aver passato.',
    easier: 'Due jolly, quadrato più grande.', harder: 'Massimo due tocchi, punto ogni 7 passaggi.',
    diagram: { field: 'free', items: [...square(20, 8, 85, 60, cone), J(52, 34), A(30, 18, 1), A(75, 20, 2), A(32, 50, 3), A(72, 50, 4), B(45, 22, 1), B(62, 26, 2), B(42, 44, 3), B(62, 46, 4), ball(33, 20), pass(33, 20, 50, 32), pass(54, 35, 70, 48), run(75, 20, 78, 34)] },
  });
  add({
    id: 'base-smarcarsi', title: 'Smarcati e ricevi', goal: 'tattica', difficulty: 2, duration: 12,
    players: '3 per gruppo', equipment: '4 cinesini, 1 pallone',
    description: 'Il passatore aspetta che il compagno si liberi dal difensore, poi passa.',
    steps: ['Un passatore fuori dal quadrato con la palla.', 'Dentro, un attaccante e un difensore.', 'L\'attaccante si muove per liberarsi e chiama la palla.', 'Se riceve e la controlla: un punto. Poi si ruota.'],
    tips: 'Insegna il "finto di qua, vado di là" e a chiamare la palla con la voce e il braccio.',
    easier: 'Il difensore è passivo.', harder: 'Dopo aver ricevuto, l\'attaccante deve condurre fino a una linea.',
    diagram: { field: 'free', items: [disc(40, 14), disc(80, 14), disc(80, 54), disc(40, 54), A(25, 34, 1), ball(28, 34), A(60, 28, 2), B(62, 34, 1), run(60, 28, 52, 20), run(52, 20, 52, 42), pass(29, 35, 50, 42)] },
  });
  add({
    id: 'base-scivolare', title: 'Difendere insieme: scivolare', goal: 'tattica', difficulty: 3, duration: 12,
    players: '6-8', equipment: 'Coni, casacche, 1 pallone',
    description: 'Una linea di 3 difensori si sposta insieme verso il lato della palla.',
    steps: ['3 difensori su una linea, 3 attaccanti davanti larghi.', 'Gli attaccanti si passano la palla lentamente.', 'I difensori scivolano insieme verso la palla, restando vicini.', 'Il più vicino alla palla esce, gli altri coprono.'],
    tips: 'Immagina di essere legati con una corda: ci si muove insieme.',
    easier: 'Senza attaccanti: i difensori seguono il braccio del mister.', harder: 'Gli attaccanti possono attaccare la porta.',
    diagram: { field: 'half', items: [B(78, 22, 1), B(78, 34, 2), B(78, 46, 3), A(55, 14, 1), A(55, 34, 2), A(55, 54, 3), ball(58, 15), pass(58, 15, 57, 31), run(78, 22, 74, 28), run(78, 34, 76, 40), run(78, 46, 78, 52), B(101, 34, 'P')] },
  });

  /* ---------------- PORTIERE ---------------- */
  add({
    id: 'base-prese', title: 'Prese alte e basse', goal: 'portiere', difficulty: 1, duration: 10,
    players: 'Portieri + 1 lanciatore', equipment: '1 porta, palloni',
    description: 'Il mister lancia con le mani palloni alti, a mezza altezza e rasoterra.',
    steps: ['Il portiere al centro della porta, ginocchia piegate.', 'Lancio basso: si piega e raccoglie con le mani a cucchiaio.', 'Lancio alto: mani a "W" sopra la testa.', 'Dopo ogni presa, palla al petto.'],
    tips: 'Inizia con palloni morbidi. Applaudi ogni presa.',
    easier: 'Lanci da molto vicino, rimbalzati.', harder: 'Calci al posto dei lanci.',
    diagram: { field: 'half', items: [B(99, 34, 'P'), M(82, 34), ball(80, 34), pass(80, 34, 97, 30), pass(80, 35, 97, 38)] },
  });
  add({
    id: 'base-parate-lati', title: 'Parate a destra e sinistra', goal: 'portiere', difficulty: 2, duration: 12,
    players: 'Portieri + 2 tiratori', equipment: '1 porta, 2 coni, palloni',
    description: 'Il portiere tocca un cono e si sposta per parare il tiro dal lato opposto.',
    steps: ['Due tiratori ai lati dell\'area.', 'Il portiere tocca il cono al centro.', 'Il mister chiama "destra" o "sinistra" e quel tiratore tira.', 'Il portiere si sposta e para.'],
    tips: 'Passi laterali, mai incrociare le gambe.', easier: 'Tiri rasoterra e lenti.', harder: 'Tiri a mezza altezza e più veloci.',
    diagram: { field: 'half', items: [B(99, 34, 'P'), cone(96, 34), A(82, 22, 1), A(82, 46, 2), ball(84, 24), ball(84, 44), shot(85, 24, 100, 31), run(99, 34, 99, 30), M(70, 34)] },
  });

  /* ---------------- PARTITA ---------------- */
  add({
    id: 'base-partitella-3pass', title: 'Partitella: 3 passaggi prima del tiro', goal: 'partita', difficulty: 2, duration: 20,
    players: '6-14', equipment: '2 porte, casacche, 1 pallone',
    description: 'Una partita normale con una regola in più: prima di tirare servono almeno 3 passaggi.',
    steps: ['Due squadre equilibrate.', 'Si gioca normalmente.', 'Il gol vale solo dopo 3 passaggi della squadra.', 'Il mister conta ad alta voce i passaggi.'],
    tips: 'Mescola le squadre in modo che siano miste: il gioco è di tutti.',
    easier: 'Basta 1 passaggio.', harder: 'Tutti i giocatori in campo devono aver toccato la palla.',
    diagram: { field: 'full', items: [goal(3.5, 34, 0), goal(101.5, 34, 180), A(20, 22, 1), A(30, 46, 2), A(45, 30, 3), ball(48, 31), B(60, 24, 1), B(70, 44, 2), B(85, 34, 3), A(5, 34, 'P'), B(100, 34, 'P'), pass(48, 31, 62, 44), run(30, 46, 60, 52)] },
  });
  add({
    id: 'base-partita-tutti', title: 'Partita "tutti protagonisti"', goal: 'partita', difficulty: 1, duration: 20,
    players: '6-16', equipment: '2 porte, casacche, 1 pallone',
    description: 'Partita libera dove il gol di chi non ha ancora segnato vale doppio.',
    steps: ['Due squadre miste ed equilibrate.', 'Si gioca libero.', 'Il primo gol di ogni giocatore vale 2 punti.', 'A metà partita cambia il portiere.'],
    tips: 'Spinge la squadra a cercare chi ancora non ha segnato. Perfetto per chiudere l\'allenamento con un sorriso.',
    easier: 'Campo più piccolo, porte più grandi.', harder: 'Massimo tre tocchi a testa.',
    diagram: { field: 'full', items: [goal(3.5, 34, 0), goal(101.5, 34, 180), A(25, 20, 1), A(35, 40, 2), A(50, 26, 3), J(52, 50), B(62, 30, 1), B(75, 46, 2), B(80, 20, 3), ball(53, 27), A(5, 34, 'P'), B(100, 34, 'P'), drib(53, 27, 68, 22), M(52, 64)] },
  });

  window.SEED_EXERCISES = E;
})();
