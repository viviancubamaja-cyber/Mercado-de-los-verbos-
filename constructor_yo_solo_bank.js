(function(){
'use strict';

// Banco lingüístico del recorrido anual. Cada escena conserva el verbo oficial
// del Mercado y usa un contexto corto de vocabulario infantil.
const S=[
 {id:'1-1',en:'sleep',past:'slept',part:'slept',p:'it',nEn:'The cat',nEs:'El gato',es:['duerme','durmió','dormido','durmiendo'],tEn:'on the sofa',tEs:'en el sofá',dEn:'quiet',dEs:'tranquilo'},
 {id:'1-2',en:'keep',past:'kept',part:'kept',p:'she',nEn:'My sister',nEs:'Mi hermana',es:['guarda','guardó','guardado','guardando'],tEn:'the key in her bag',tEs:'la llave en su bolso',dEn:'careful',dEs:'cuidadosa'},
 {id:'1-3',en:'meet',past:'met',part:'met',p:'they',nEn:'The dolphins',nEs:'Los delfines',es:['encuentran','encontraron','encontrado','encontrando'],tEn:'at sea',tEs:'en el mar',dEn:'friendly',dEs:'amigables',refl:true},
 {id:'1-4',en:'feel',past:'felt',part:'felt',p:'I',nEn:'I',nEs:'Yo',es:['siento','sentí','sentido','sintiendo'],tEn:'happy today',tEs:'feliz hoy',dEn:'fine',dEs:'bien',refl:true},
 {id:'1-5',en:'sweep',past:'swept',part:'swept',p:'he',nEn:'The farmer',nEs:'El granjero',es:['barre','barrió','barrido','barriendo'],tEn:'the barn',tEs:'el granero',dEn:'tired',dEs:'cansado'},
 {id:'1-6',en:'leave',past:'left',part:'left',p:'she',nEn:'My mother',nEs:'Mi madre',es:['sale','salió','salido','saliendo'],tEn:'home early',tEs:'de casa temprano',dEn:'busy',dEs:'ocupada'},
 {id:'1-7',en:'lose',past:'lost',part:'lost',p:'you',nEn:'You',nEs:'Tú',es:['pierdes','perdiste','perdido','perdiendo'],tEn:'your blue pencil',tEs:'tu lápiz azul',dEn:'sad',dEs:'triste'},
 {id:'1-8',en:'shoot',past:'shot',part:'shot',p:'he',nEn:'The photographer',nEs:'El fotógrafo',es:['graba','grabó','grabado','grabando'],tEn:'a video at school',tEs:'un vídeo en el colegio',dEn:'creative',dEs:'creativo'},
 {id:'1-9',en:'light',past:'lit',part:'lit',p:'she',nEn:'My grandmother',nEs:'Mi abuela',es:['enciende','encendió','encendido','encendiendo'],tEn:'the lamp',tEs:'la lámpara',dEn:'careful',dEs:'cuidadosa'},
 {id:'1-10',en:'sit',past:'sat',part:'sat',p:'it',nEn:'The dog',nEs:'El perro',es:['sienta','sentó','sentado','sentando'],tEn:'by the door',tEs:'junto a la puerta',dEn:'quiet',dEs:'tranquilo',refl:true,noProgress:true},

 {id:'2-1',en:'bend',past:'bent',part:'bent',p:'we',nEn:'My friends and I',nEs:'Mis amigos y yo',es:['doblamos','doblamos','doblado','doblando'],tEn:'our knees',tEs:'las rodillas',dEn:'strong',dEs:'fuertes'},
 {id:'2-2',en:'lend',past:'lent',part:'lent',p:'you',nEn:'You',nEs:'Tú',es:['prestas','prestaste','prestado','prestando'],tEn:'a book to your friend',tEs:'un libro a tu amigo',dEn:'kind',dEs:'amable'},
 {id:'2-3',en:'send',past:'sent',part:'sent',p:'I',nEn:'I',nEs:'Yo',es:['envío','envié','enviado','enviando'],tEn:'a message to my family',tEs:'un mensaje a mi familia',dEn:'ready',dEs:'preparado'},
 {id:'2-4',en:'spend',past:'spent',part:'spent',p:'we',nEn:'My family and I',nEs:'Mi familia y yo',es:['pasamos','pasamos','pasado','pasando'],tEn:'the afternoon at the zoo',tEs:'la tarde en el zoo',dEn:'happy',dEs:'felices'},
 {id:'2-5',en:'build',past:'built',part:'built',p:'they',nEn:'The beavers',nEs:'Los castores',es:['construyen','construyeron','construido','construyendo'],tEn:'a dam in the river',tEs:'una presa en el río',dEn:'busy',dEs:'ocupados'},

 {id:'3-1',en:'dream',past:'dreamt',part:'dreamt',p:'you',nEn:'You',nEs:'Tú',es:['sueñas','soñaste','soñado','soñando'],tEn:'about space',tEs:'con el espacio',dEn:'happy',dEs:'feliz'},
 {id:'3-2',en:'mean',past:'meant',part:'meant',p:'it',nEn:'The red light',nEs:'La luz roja',es:['significa','significó','significado','significando'],tEn:'danger',tEs:'peligro',dEn:'important',dEs:'importante',noProgress:true},
 {id:'3-3',en:'burn',past:'burnt',part:'burnt',p:'it',nEn:'The fire',nEs:'El fuego',es:['arde','ardió','ardido','ardiendo'],tEn:'in the fireplace',tEs:'en la chimenea',dEn:'hot',dEs:'caliente'},
 {id:'3-4',en:'learn',past:'learnt',part:'learnt',p:'they',nEn:'The students',nEs:'Los estudiantes',es:['aprenden','aprendieron','aprendido','aprendiendo'],tEn:'the animal names',tEs:'los nombres de los animales',dEn:'clever',dEs:'listos'},
 {id:'3-5',en:'smell',past:'smelt',part:'smelt',p:'it',nEn:'The dog',nEs:'El perro',es:['huele','olió','olido','oliendo'],tEn:'the flowers',tEs:'las flores',dEn:'curious',dEs:'curioso'},
 {id:'3-6',en:'lead',past:'led',part:'led',p:'she',nEn:'The guide',nEs:'La guía',es:['guía','guio','guiado','guiando'],tEn:'the children to the farm',tEs:'a los niños a la granja',dEn:'kind',dEs:'amable'},
 {id:'3-7',en:'bleed',past:'bled',part:'bled',p:'it',nEn:'The knee',nEs:'La rodilla',es:['sangra','sangró','sangrado','sangrando'],tEn:'after the fall',tEs:'después de la caída',dEn:'sore',dEs:'dolorida'},
 {id:'3-8',en:'feed',past:'fed',part:'fed',p:'he',nEn:'The farmer',nEs:'El granjero',es:['alimenta','alimentó','alimentado','alimentando'],tEn:'the horse',tEs:'al caballo',dEn:'kind',dEs:'amable'},

 {id:'4-1',en:'put',past:'put',part:'put',p:'she',nEn:'The girl',nEs:'La niña',es:['pone','puso','puesto','poniendo'],tEn:'the book on the table',tEs:'el libro sobre la mesa',dEn:'careful',dEs:'cuidadosa'},
 {id:'4-2',en:'cost',past:'cost',part:'cost',p:'it',nEn:'The toy',nEs:'El juguete',es:['cuesta','costó','costado','costando'],tEn:'ten euros',tEs:'diez euros',dEn:'expensive',dEs:'caro',noProgress:true},
 {id:'4-3',en:'shut',past:'shut',part:'shut',p:'he',nEn:'The boy',nEs:'El niño',es:['cierra','cerró','cerrado','cerrando'],tEn:'the door',tEs:'la puerta',dEn:'quiet',dEs:'tranquilo'},
 {id:'4-4',en:'let',past:'let',part:'let',p:'she',nEn:'The mother',nEs:'La madre',es:['deja','dejó','dejado','dejando'],tEn:'the children play',tEs:'jugar a los niños',dEn:'kind',dEs:'amable',noProgress:true},
 {id:'4-5',en:'cut',past:'cut',part:'cut',p:'she',nEn:'The cook',nEs:'La cocinera',es:['corta','cortó','cortado','cortando'],tEn:'the apple',tEs:'la manzana',dEn:'busy',dEs:'ocupada'},
 {id:'4-6',en:'set',past:'set',part:'set',p:'she',nEn:'The teacher',nEs:'La profesora',es:['ajusta','ajustó','ajustado','ajustando'],tEn:'the clock',tEs:'el reloj',dEn:'ready',dEs:'preparada'},
 {id:'4-7',en:'hit',past:'hit',part:'hit',p:'he',nEn:'The boy',nEs:'El niño',es:['golpea','golpeó','golpeado','golpeando'],tEn:'the ball',tEs:'la pelota',dEn:'strong',dEs:'fuerte'},
 {id:'4-8',en:'hurt',past:'hurt',part:'hurt',p:'it',nEn:'My arm',nEs:'Mi brazo',es:['duele','dolió','dolido','doliendo'],tEn:'after the game',tEs:'después del partido',dEn:'sore',dEs:'dolorido',noProgress:true},
 {id:'4-9',en:'bet',past:'bet',part:'bet',p:'they',nEn:'The children',nEs:'Los niños',es:['apuestan','apostaron','apostado','apostando'],tEn:'on the blue team',tEs:'por el equipo azul',dEn:'excited',dEs:'emocionados'},
 {id:'4-10',en:'read',past:'read',part:'read',p:'she',nEn:'The girl',nEs:'La niña',es:['lee','leyó','leído','leyendo'],tEn:'an animal book',tEs:'un libro de animales',dEn:'happy',dEs:'contenta'},

 {id:'5-1',en:'blow',past:'blew',part:'blown',p:'it',nEn:'The wind',nEs:'El viento',es:['sopla','sopló','soplado','soplando'],tEn:'hard today',tEs:'fuerte hoy',dEn:'cold',dEs:'frío'},
 {id:'5-2',en:'throw',past:'threw',part:'thrown',p:'he',nEn:'The goalkeeper',nEs:'El portero',es:['lanza','lanzó','lanzado','lanzando'],tEn:'the ball',tEs:'la pelota',dEn:'strong',dEs:'fuerte'},
 {id:'5-3',en:'grow',past:'grew',part:'grown',p:'it',nEn:'The sunflower',nEs:'El girasol',es:['crece','creció','crecido','creciendo'],tEn:'in the garden',tEs:'en el jardín',dEn:'yellow',dEs:'amarillo'},
 {id:'5-4',en:'know',past:'knew',part:'known',p:'she',nEn:'The girl',nEs:'La niña',es:['sabe','supo','sabido','sabiendo'],tEn:'the answer',tEs:'la respuesta',dEn:'clever',dEs:'lista',noProgress:true},
 {id:'5-5',en:'draw',past:'drew',part:'drawn',p:'he',nEn:'The child',nEs:'El niño',es:['dibuja','dibujó','dibujado','dibujando'],tEn:'a dolphin',tEs:'un delfín',dEn:'creative',dEs:'creativo'},
 {id:'5-6',en:'show',past:'showed',part:'shown',p:'she',nEn:'The teacher',nEs:'La profesora',es:['muestra','mostró','mostrado','mostrando'],tEn:'a picture to the class',tEs:'un dibujo a la clase',dEn:'kind',dEs:'amable'},
 {id:'5-7',en:'fly',past:'flew',part:'flown',p:'they',nEn:'The birds',nEs:'Los pájaros',es:['vuelan','volaron','volado','volando'],tEn:'over the farm',tEs:'sobre la granja',dEn:'free',dEs:'libres'},

 {id:'6-1',en:'break',past:'broke',part:'broken',p:'it',nEn:'The monkey',nEs:'El mono',es:['rompe','rompió','roto','rompiendo'],tEn:'a branch',tEs:'una rama',dEn:'strong',dEs:'fuerte'},
 {id:'6-2',en:'speak',past:'spoke',part:'spoken',p:'we',nEn:'My friends and I',nEs:'Mis amigos y yo',es:['hablamos','hablamos','hablado','hablando'],tEn:'to the teacher',tEs:'con la profesora',dEn:'calm',dEs:'tranquilos'},
 {id:'6-3',en:'steal',past:'stole',part:'stolen',p:'it',nEn:'The fox',nEs:'El zorro',es:['roba','robó','robado','robando'],tEn:"the farmer's egg",tEs:'el huevo del granjero',dEn:'hungry',dEs:'hambriento'},
 {id:'6-4',en:'tear',past:'tore',part:'torn',p:'he',nEn:'The baby',nEs:'El bebé',es:['rompe','rompió','roto','rompiendo'],tEn:'the paper',tEs:'el papel',dEn:'curious',dEs:'curioso'},
 {id:'6-5',en:'wear',past:'wore',part:'worn',p:'I',nEn:'I',nEs:'Yo',es:['llevo','llevé','llevado','llevando'],tEn:'a red coat',tEs:'un abrigo rojo',dEn:'ready',dEs:'preparado'},
 {id:'6-6',en:'freeze',past:'froze',part:'frozen',p:'it',nEn:'The water',nEs:'El agua',es:['congela','congeló','congelado','congelando'],tEn:'in winter',tEs:'en invierno',dEn:'cold',dEs:'fría',refl:true},
 {id:'6-7',en:'wake',past:'woke',part:'woken',p:'he',nEn:'The father',nEs:'El padre',es:['despierta','despertó','despertado','despertando'],tEn:'the baby early',tEs:'al bebé temprano',dEn:'tired',dEs:'cansado'},
 {id:'6-8',en:'choose',past:'chose',part:'chosen',p:'you',nEn:'You',nEs:'Tú',es:['eliges','elegiste','elegido','eligiendo'],tEn:'the blue dress',tEs:'el vestido azul',dEn:'happy',dEs:'feliz'},

 {id:'7-1',en:'get',past:'got',part:'got',p:'we',nEn:'My brother and I',nEs:'Mi hermano y yo',es:['recibimos','recibimos','recibido','recibiendo'],tEn:'a new bike',tEs:'una bicicleta nueva',dEn:'excited',dEs:'emocionados'},
 {id:'7-2',en:'forget',past:'forgot',part:'forgotten',p:'I',nEn:'I',nEs:'Yo',es:['olvido','olvidé','olvidado','olvidando'],tEn:'my homework',tEs:'mis deberes',dEn:'sad',dEs:'triste'},
 {id:'7-3',en:'drive',past:'drove',part:'driven',p:'she',nEn:'My mother',nEs:'Mi madre',es:['conduce','condujo','conducido','conduciendo'],tEn:'the bus',tEs:'el autobús',dEn:'careful',dEs:'cuidadosa'},
 {id:'7-4',en:'ride',past:'rode',part:'ridden',p:'she',nEn:'The cowgirl',nEs:'La vaquera',es:['monta','montó','montado','montando'],tEn:'the horse',tEs:'el caballo',dEn:'brave',dEs:'valiente'},
 {id:'7-5',en:'rise',past:'rose',part:'risen',p:'it',nEn:'The sun',nEs:'El sol',es:['sale','salió','salido','saliendo'],tEn:'at seven',tEs:'a las siete',dEn:'bright',dEs:'brillante'},
 {id:'7-6',en:'write',past:'wrote',part:'written',p:'you',nEn:'You',nEs:'Tú',es:['escribes','escribiste','escrito','escribiendo'],tEn:'a story about a shark',tEs:'un cuento sobre un tiburón',dEn:'creative',dEs:'creativo'},
 {id:'7-7',en:'give',past:'gave',part:'given',p:'we',nEn:'The nurses and I',nEs:'Las enfermeras y yo',es:['damos','dimos','dado','dando'],tEn:'water to the child',tEs:'agua al niño',dEn:'kind',dEs:'amables'},
 {id:'7-8',en:'forgive',past:'forgave',part:'forgiven',p:'she',nEn:'The mother',nEs:'La madre',es:['perdona','perdonó','perdonado','perdonando'],tEn:'the boy',tEs:'al niño',dEn:'kind',dEs:'amable',noProgress:true},

 {id:'8-1',en:'eat',past:'ate',part:'eaten',p:'it',nEn:'The lion',nEs:'El león',es:['come','comió','comido','comiendo'],tEn:'the meat',tEs:'la carne',dEn:'hungry',dEs:'hambriento'},
 {id:'8-2',en:'fall',past:'fell',part:'fallen',p:'they',nEn:'The leaves',nEs:'Las hojas',es:['caen','cayeron','caído','cayendo'],tEn:'from the tree',tEs:'del árbol',dEn:'brown',dEs:'marrones'},
 {id:'8-3',en:'beat',past:'beat',part:'beaten',p:'it',nEn:'The heart',nEs:'El corazón',es:['late','latió','latido','latiendo'],tEn:'fast',tEs:'rápido',dEn:'healthy',dEs:'sano'},
 {id:'8-4',en:'bite',past:'bit',part:'bitten',p:'it',nEn:'The shark',nEs:'El tiburón',es:['muerde','mordió','mordido','mordiendo'],tEn:'the fish',tEs:'al pez',dEn:'hungry',dEs:'hambriento'},
 {id:'8-5',en:'hide',past:'hid',part:'hidden',p:'it',nEn:'The rabbit',nEs:'El conejo',es:['esconde','escondió','escondido','escondiendo'],tEn:'the carrot under the bed',tEs:'la zanahoria debajo de la cama',dEn:'clever',dEs:'listo'},
 {id:'8-6',en:'forbid',past:'forbade',part:'forbidden',p:'she',nEn:'The teacher',nEs:'La profesora',es:['prohíbe','prohibió','prohibido','prohibiendo'],tEn:'phones in class',tEs:'los móviles en clase',dEn:'strict',dEs:'estricta',noProgress:true},
 {id:'8-7',en:'see',past:'saw',part:'seen',p:'we',nEn:'My friends and I',nEs:'Mis amigos y yo',es:['vemos','vimos','visto','viendo'],tEn:'a whale',tEs:'una ballena',dEn:'excited',dEs:'emocionados'},
 {id:'8-8',en:'take',past:'took',part:'taken',p:'you',nEn:'You',nEs:'Tú',es:['llevas','llevaste','llevado','llevando'],tEn:'the bag to the hospital',tEs:'el bolso al hospital',dEn:'busy',dEs:'ocupado'},
 {id:'8-9',en:'shake',past:'shook',part:'shaken',p:'she',nEn:'The cook',nEs:'La cocinera',es:['agita','agitó','agitado','agitando'],tEn:'the bottle',tEs:'la botella',dEn:'busy',dEs:'ocupada'},

 {id:'9-1',en:'ring',past:'rang',part:'rung',p:'she',nEn:'The girl',nEs:'La niña',es:['llama','llamó','llamado','llamando'],tEn:'her grandmother after school',tEs:'a su abuela después del colegio',dEn:'happy',dEs:'contenta'},
 {id:'9-2',en:'drink',past:'drank',part:'drunk',p:'it',nEn:'The horse',nEs:'El caballo',es:['bebe','bebió','bebido','bebiendo'],tEn:'water',tEs:'agua',dEn:'thirsty',dEs:'sediento'},
 {id:'9-3',en:'begin',past:'began',part:'begun',p:'it',nEn:'The class',nEs:'La clase',es:['comienza','comenzó','comenzado','comenzando'],tEn:'at nine',tEs:'a las nueve',dEn:'interesting',dEs:'interesante'},
 {id:'9-4',en:'sink',past:'sank',part:'sunk',p:'it',nEn:'The boat',nEs:'El barco',es:['hunde','hundió','hundido','hundiendo'],tEn:'in the sea',tEs:'en el mar',dEn:'old',dEs:'viejo',refl:true},
 {id:'9-5',en:'swim',past:'swam',part:'swum',p:'it',nEn:'The dolphin',nEs:'El delfín',es:['nada','nadó','nadado','nadando'],tEn:'during the show',tEs:'durante el espectáculo',dEn:'fast',dEs:'rápido',negativeStory:{presentEn:'It is tired.',pastEn:'It was tired.',presentEs:'Está cansado.',pastEs:'Estaba cansado.'}},
 {id:'9-6',en:'sing',past:'sang',part:'sung',p:'they',nEn:'The birds',nEs:'Los pájaros',es:['cantan','cantaron','cantado','cantando'],tEn:'in the tree',tEs:'en el árbol',dEn:'happy',dEs:'contentos'},
 {id:'9-7',en:'run',past:'ran',part:'run',p:'it',nEn:'The dog',nEs:'El perro',es:['corre','corrió','corrido','corriendo'],tEn:'in the park',tEs:'en el parque',dEn:'happy',dEs:'contento'},

 {id:'10-1',en:'bring',past:'brought',part:'brought',p:'we',nEn:'My father and I',nEs:'Mi padre y yo',es:['traemos','trajimos','traído','trayendo'],tEn:'food home',tEs:'comida a casa',dEn:'helpful',dEs:'serviciales'},
 {id:'10-2',en:'buy',past:'bought',part:'bought',p:'she',nEn:'My mother',nEs:'Mi madre',es:['compra','compró','comprado','comprando'],tEn:'apples at the market',tEs:'manzanas en el mercado',dEn:'busy',dEs:'ocupada'},
 {id:'10-3',en:'fight',past:'fought',part:'fought',p:'they',nEn:'The lions',nEs:'Los leones',es:['pelean','pelearon','peleado','peleando'],tEn:'for food',tEs:'por la comida',dEn:'angry',dEs:'enfadados'},
 {id:'10-4',en:'think',past:'thought',part:'thought',p:'I',nEn:'I',nEs:'Yo',es:['pienso','pensé','pensado','pensando'],tEn:'about my family',tEs:'en mi familia',dEn:'calm',dEs:'tranquilo'},
 {id:'10-5',en:'catch',past:'caught',part:'caught',p:'it',nEn:'The cat',nEs:'El gato',es:['atrapa','atrapó','atrapado','atrapando'],tEn:'the red ball',tEs:'la pelota roja',dEn:'fast',dEs:'rápido'},
 {id:'10-6',en:'teach',past:'taught',part:'taught',p:'she',nEn:'The teacher',nEs:'La profesora',es:['enseña','enseñó','enseñado','enseñando'],tEn:'the children at school',tEs:'a los niños en el colegio',dEn:'kind',dEs:'amable'},

 {id:'11-1',en:'sell',past:'sold',part:'sold',p:'he',nEn:'The farmer',nEs:'El granjero',es:['vende','vendió','vendido','vendiendo'],tEn:'eggs at the market',tEs:'huevos en el mercado',dEn:'busy',dEs:'ocupado'},
 {id:'11-2',en:'tell',past:'told',part:'told',p:'you',nEn:'You',nEs:'Tú',es:['cuentas','contaste','contado','contando'],tEn:'a story to the children',tEs:'un cuento a los niños',dEn:'kind',dEs:'amable'},
 {id:'11-3',en:'have',past:'had',part:'had',p:'she',nEn:'The girl',nEs:'La niña',es:['tiene','tuvo','tenido','teniendo'],tEn:'two cats',tEs:'dos gatos',dEn:'happy',dEs:'contenta',noProgress:true},
 {id:'11-4',en:'hold',past:'held',part:'held',p:'he',nEn:'The child',nEs:'El niño',es:['sostiene','sostuvo','sostenido','sosteniendo'],tEn:"his mother's hand",tEs:'la mano de su madre',dEn:'safe',dEs:'seguro'},
 {id:'11-5',en:'lay',past:'laid',part:'laid',p:'it',nEn:'The hen',nEs:'La gallina',es:['pone','puso','puesto','poniendo'],tEn:'an egg in the nest',tEs:'un huevo en el nido',dEn:'quiet',dEs:'tranquila'},
 {id:'11-6',en:'say',past:'said',part:'said',p:'I',nEn:'I',nEs:'Yo',es:['digo','dije','dicho','diciendo'],tEn:'hello to the doctor',tEs:'hola a la doctora',dEn:'polite',dEs:'educado'},
 {id:'11-7',en:'pay',past:'paid',part:'paid',p:'we',nEn:'My family and I',nEs:'Mi familia y yo',es:['pagamos','pagamos','pagado','pagando'],tEn:'for the food',tEs:'la comida',dEn:'ready',dEs:'preparados'},

 {id:'12-1',en:'hear',past:'heard',part:'heard',p:'you',nEn:'You',nEs:'Tú',es:['oyes','oíste','oído','oyendo'],tEn:'a bird in the garden',tEs:'un pájaro en el jardín',dEn:'curious',dEs:'curioso'},
 {id:'12-2',en:'stand',past:'stood',part:'stood',p:'it',nEn:'The horse',nEs:'El caballo',es:['pone de pie','puso de pie','puesto de pie','poniendo de pie'],tEn:'up by the door',tEs:'junto a la puerta',dEn:'quiet',dEs:'tranquilo',refl:true,noProgress:true},
 {id:'12-3',en:'understand',past:'understood',part:'understood',p:'we',nEn:'My classmates and I',nEs:'Mis compañeros y yo',es:['entendemos','entendimos','entendido','entendiendo'],tEn:'the story',tEs:'el cuento',dEn:'clever',dEs:'listos'},
 {id:'12-4',en:'make',past:'made',part:'made',p:'he',nEn:'The cook',nEs:'El cocinero',es:['hace','hizo','hecho','haciendo'],tEn:'soup for the family',tEs:'sopa para la familia',dEn:'busy',dEs:'ocupado'},
 {id:'12-5',en:'dig',past:'dug',part:'dug',p:'it',nEn:'The dog',nEs:'El perro',es:['cava','cavó','cavado','cavando'],tEn:'a hole in the garden',tEs:'un agujero en el jardín',dEn:'dirty',dEs:'sucio'},
 {id:'12-6',en:'hang',past:'hung',part:'hung',p:'he',nEn:'The father',nEs:'El padre',es:['cuelga','colgó','colgado','colgando'],tEn:'a picture on the wall',tEs:'un cuadro en la pared',dEn:'careful',dEs:'cuidadoso'},

 {id:'13-1',en:'bind',past:'bound',part:'bound',p:'she',nEn:'The vet',nEs:'La veterinaria',es:['venda','vendó','vendado','vendando'],tEn:"the dog's leg",tEs:'la pata del perro',dEn:'careful',dEs:'cuidadosa'},
 {id:'13-2',en:'find',past:'found',part:'found',p:'I',nEn:'I',nEs:'Yo',es:['encuentro','encontré','encontrado','encontrando'],tEn:'a shell on the beach',tEs:'una concha en la playa',dEn:'happy',dEs:'feliz'},
 {id:'13-3',en:'grind',past:'ground',part:'ground',p:'he',nEn:'The cook',nEs:'El cocinero',es:['muele','molió','molido','moliendo'],tEn:'corn for the soup',tEs:'maíz para la sopa',dEn:'busy',dEs:'ocupado'},
 {id:'13-4',en:'wind',past:'wound',part:'wound',p:'she',nEn:'The girl',nEs:'La niña',es:['enrolla','enrolló','enrollado','enrollando'],tEn:'the wool into a ball',tEs:'la lana en un ovillo',dEn:'careful',dEs:'cuidadosa'},
 {id:'13-5',en:'win',past:'won',part:'won',p:'we',nEn:'My team and I',nEs:'Mi equipo y yo',es:['ganamos','ganamos','ganado','ganando'],tEn:'the game at school',tEs:'el partido en el colegio',dEn:'proud',dEs:'orgullosos'},

 {id:'14-1',en:'lie',past:'lay',part:'lain',p:'it',nEn:'The cat',nEs:'El gato',es:['tumba','tumbó','tumbado','tumbando'],tEn:'on the bed',tEs:'en la cama',dEn:'sleepy',dEs:'soñoliento',refl:true},
 {id:'14-2',en:'lie',past:'lied',part:'lied',p:'he',nEn:'The boy',nEs:'El niño',es:['miente','mintió','mentido','mintiendo'],tEn:'about the broken toy',tEs:'sobre el juguete roto',dEn:'worried',dEs:'preocupado',noProgress:true},
 {id:'14-3',en:'shine',past:'shone',part:'shone',p:'they',nEn:'The stars',nEs:'Las estrellas',es:['brillan','brillaron','brillado','brillando'],tEn:'at night',tEs:'por la noche',dEn:'bright',dEs:'brillantes'},
 {id:'14-4',en:'come',past:'came',part:'come',p:'you',nEn:'You',nEs:'Tú',es:['vienes','viniste','venido','viniendo'],tEn:'to our house',tEs:'a nuestra casa',dEn:'welcome',dEs:'bienvenido'},
 {id:'14-5',en:'become',past:'became',part:'become',p:'it',nEn:'The caterpillar',nEs:'La oruga',es:['convierte','convirtió','convertido','convirtiendo'],tEn:'a butterfly',tEs:'en una mariposa',dEn:'beautiful',dEs:'hermosa',refl:true,noProgress:true},

 {id:'15-1',en:'go',past:'went',part:'gone',p:'we',nEn:'My family and I',nEs:'Mi familia y yo',es:['vamos','fuimos','ido','yendo'],tEn:'to the beach',tEs:'a la playa',dEn:'happy',dEs:'felices'},
 {id:'15-2',en:'do',past:'did',part:'done',p:'you',nEn:'You',nEs:'Tú',es:['haces','hiciste','hecho','haciendo'],tEn:'your homework after school',tEs:'tus deberes después del colegio',dEn:'ready',dEs:'preparado'},
 {id:'15-3',en:'melt',past:'melted',part:'melted',p:'it',nEn:'The ice cream',nEs:'El helado',es:['derrite','derritió','derretido','derritiendo'],tEn:'on the table',tEs:'sobre la mesa',dEn:'sticky',dEs:'pegajoso',refl:true,meltStory:true},
 {id:'15-4',en:'be',past:'was/were',part:'been',p:'she',nEn:'The teacher',nEs:'La profesora',es:['está','estuvo','estado','estando'],tEn:'in the classroom',tEs:'en el aula',dEn:'kind',dEs:'amable',noProgress:true}
];

const TENSES=[
 {id:'present',name:'Presente'},
 {id:'past',name:'Pasado'},
 {id:'present-perfect',name:'Presente perfecto'},
 {id:'past-perfect',name:'Pasado perfecto'},
 {id:'present-continuous',name:'Presente continuo'},
 {id:'past-continuous',name:'Pasado continuo'},
 {id:'present-perfect-continuous',name:'Presente perfecto continuo'},
 {id:'past-perfect-continuous',name:'Pasado perfecto continuo'}
];
const K={A:'affirmative',N:'negative',Q:'question'};
const PRON_EN={I:'I',you:'You',he:'He',she:'She',it:'It',we:'We',they:'They'};
const PRON_ES={I:'Yo',you:'Tú',he:'Él',she:'Ella',we:'Nosotros',they:'Ellos'};
const REFL_ES={I:'me',you:'te',he:'se',she:'se',it:'se',we:'nos',they:'se'};
const HAVE_ES={
 present:{I:'he',you:'has',he:'ha',she:'ha',it:'ha',we:'hemos',they:'han'},
 past:{I:'había',you:'habías',he:'había',she:'había',it:'había',we:'habíamos',they:'habían'}
};
const BE_ES={
 present:{I:'estoy',you:'estás',he:'está',she:'está',it:'está',we:'estamos',they:'están'},
 past:{I:'estaba',you:'estabas',he:'estaba',she:'estaba',it:'estaba',we:'estábamos',they:'estaban'}
};
const SER_ES={I:'soy',you:'eres',he:'es',she:'es',it:'es',we:'somos',they:'son'};
const SER_DESCRIPTORS=new Set(['careful','friendly','creative','strong','kind','important','clever','expensive','tall','free','brave','bright','strict','interesting','old','helpful','polite','beautiful','yellow','brown','curious','fast','welcome']);
const BE_EN={
 present:{I:'am',you:'are',he:'is',she:'is',it:'is',we:'are',they:'are'},
 past:{I:'was',you:'were',he:'was',she:'was',it:'was',we:'were',they:'were'}
};
const NEG_BE_EN={
 present:{I:'am not',you:"aren't",he:"isn't",she:"isn't",it:"isn't",we:"aren't",they:"aren't"},
 past:{I:"wasn't",you:"weren't",he:"wasn't",she:"wasn't",it:"wasn't",we:"weren't",they:"weren't"}
};
const VERB_MEANINGS={
 sleep:'dormir',keep:'guardar',meet:'encontrarse',feel:'sentir',sweep:'barrer',leave:'irse',lose:'perder',shoot:'grabar',light:'encender',sit:'sentarse',
 bend:'doblar',lend:'prestar',send:'enviar',spend:'pasar',build:'construir',dream:'soñar',mean:'significar',burn:'arder',learn:'aprender',smell:'oler',
 lead:'guiar',bleed:'sangrar',feed:'alimentar',put:'poner',cost:'costar',shut:'cerrar',let:'dejar',cut:'cortar',set:'ajustar',hit:'golpear',
 hurt:'doler',bet:'apostar',read:'leer',blow:'soplar',throw:'lanzar',grow:'crecer',know:'saber',draw:'dibujar',show:'mostrar',fly:'volar',
 break:'romper',speak:'hablar',steal:'robar',tear:'romper',wear:'llevar puesto',freeze:'congelarse',wake:'despertar',choose:'elegir',get:'recibir',forget:'olvidar',
 drive:'conducir',ride:'montar',rise:'salir',write:'escribir',give:'dar',forgive:'perdonar',eat:'comer',fall:'caer',beat:'latir',bite:'morder',
 hide:'esconder',forbid:'prohibir',see:'ver',take:'llevar',shake:'agitar',ring:'llamar',drink:'beber',begin:'comenzar',sink:'hundirse',swim:'nadar',
 sing:'cantar',run:'correr',bring:'traer',buy:'comprar',fight:'pelear',think:'pensar',catch:'atrapar',teach:'enseñar',sell:'vender',tell:'contar',
 have:'tener',hold:'sostener',lay:'poner',say:'decir',pay:'pagar',hear:'oír',stand:'estar de pie',understand:'entender',make:'hacer',dig:'cavar',
 hang:'colgar',bind:'vendar',find:'encontrar',grind:'moler',wind:'enrollar',win:'ganar',lie:'tumbarse / mentir',shine:'brillar',come:'venir',become:'convertirse',
 go:'ir',do:'hacer',melt:'derretirse',be:'ser / estar'
};
const EXTRA_GLOSS={
 the:'el / la / los / las',a:'un / una',an:'un / una',my:'mi',your:'tu',his:'su',her:'su',our:'nuestro / nuestra',their:'su',
 and:'y',to:'a',in:'en',on:'sobre / en',at:'en / a',by:'junto a',from:'de / desde',for:'para / por',about:'sobre',after:'después de',
 before:'antes de',under:'debajo de',over:'sobre',into:'en',of:'de',with:'con',today:'hoy',early:'temprano',hard:'fuerte',fast:'rápido',
 home:'casa',school:'colegio',sea:'mar',sofa:'sofá',key:'llave',bag:'bolso',barn:'granero',pencil:'lápiz',video:'vídeo',lamp:'lámpara',
 door:'puerta',knees:'rodillas',book:'libro',friend:'amigo',message:'mensaje',family:'familia',afternoon:'tarde',zoo:'zoo',river:'río',
 space:'espacio',stop:'parar',fireplace:'chimenea',animal:'animal',animals:'animales',names:'nombres',flowers:'flores',children:'niños',
 farm:'granja',knee:'rodilla',horse:'caballo',girl:'niña',toy:'juguete',euros:'euros',mother:'madre',play:'jugar',cook:'cocinero / cocinera',
 apple:'manzana',teacher:'profesor / profesora',clock:'reloj',boy:'niño',ball:'pelota',arm:'brazo',team:'equipo',blue:'azul',
 wind:'viento',goalkeeper:'portero',sunflower:'girasol',garden:'jardín',answer:'respuesta',child:'niño',dolphin:'delfín',picture:'dibujo',
 class:'clase',birds:'pájaros',bird:'pájaro',branch:'rama',paper:'papel',coat:'abrigo',red:'rojo',water:'agua',winter:'invierno',
 father:'padre',baby:'bebé',dress:'vestido',brother:'hermano',bike:'bicicleta',homework:'deberes',bus:'autobús',cowgirl:'vaquera',
 sun:'sol',seven:'siete',story:'cuento',shark:'tiburón',nurses:'enfermeras',nurse:'enfermera',lion:'león',meat:'carne',leaves:'hojas',
 tree:'árbol',heart:'corazón',fish:'pez',rabbit:'conejo',carrot:'zanahoria',bed:'cama',phones:'móviles',whale:'ballena',hospital:'hospital',
 bottle:'botella',grandmother:'abuela',nine:'nueve',boat:'barco',dolphins:'delfines',park:'parque',food:'comida',apples:'manzanas',
 market:'mercado',lions:'leones',cat:'gato',students:'estudiantes',eggs:'huevos',grandfather:'abuelo',cats:'gatos',hand:'mano',
 hen:'gallina',egg:'huevo',nest:'nido',hello:'hola',doctor:'doctor / doctora',gate:'puerta',classmates:'compañeros',soup:'sopa',
 hole:'agujero',wall:'pared',vet:'veterinario / veterinaria',dog:'perro',leg:'pata',shell:'concha',beach:'playa',corn:'maíz',
 wool:'lana',game:'partido',stars:'estrellas',night:'noche',house:'casa',caterpillar:'oruga',butterfly:'mariposa',ice:'hielo',
 classroom:'aula',quiet:'tranquilo',careful:'cuidadoso',friendly:'amigable',fine:'bien',tired:'cansado',busy:'ocupado',sad:'triste',
 creative:'creativo',strong:'fuerte',kind:'amable',ready:'preparado',happy:'contento / feliz',important:'importante',hot:'caliente',
 clever:'listo',curious:'curioso',sore:'dolorido',expensive:'caro',excited:'emocionado',cold:'frío',tall:'alto',free:'libre',
 hungry:'hambriento',brave:'valiente',bright:'brillante',strict:'estricto',brown:'marrón',healthy:'sano',thirsty:'sediento',
 interesting:'interesante',old:'viejo',angry:'enfadado',helpful:'servicial',safe:'seguro',polite:'educado',dirty:'sucio',
 proud:'orgulloso',sleepy:'soñoliento',worried:'preocupado',welcome:'bienvenido',beautiful:'hermoso',wet:'mojado',yellow:'amarillo',
 beavers:'castores',calm:'tranquilo',"dog's":'del perro',farmer:'granjero',"farmer's":'del granjero',fire:'fuego',fox:'zorro',
 friends:'amigos',guide:'guía',monkey:'mono',"mother's":'de su madre',new:'nuevo',photographer:'fotógrafo',sister:'hermana',
 table:'mesa',ten:'diez',two:'dos',every:'cada',day:'día',yesterday:'ayer',week:'semana',this:'esta',last:'pasada',
 dam:'presa',but:'pero',up:'de pie',beside:'junto a',during:'durante',show:'espectáculo',cream:'helado',sticky:'pegajoso',everything:'todo',clean:'limpio',
 lunch:'almuerzo',now:'ahora',six:'seis',dinner:'cena',danger:'peligro'
};

function cap(s){return String(s).charAt(0).toUpperCase()+String(s).slice(1)}
function low(s){return String(s)==='I'?'I':String(s).charAt(0).toLowerCase()+String(s).slice(1)}
function third(v){
 if(v==='be')return'is';
 if(v==='have')return'has';
 if(/[^aeiou]y$/.test(v))return v.slice(0,-1)+'ies';
 if(/(?:s|sh|ch|x|o)$/.test(v))return v+'es';
 return v+'s'
}
function ing(v){
 const special={be:'being',lie:'lying',see:'seeing'};
 if(special[v])return special[v];
 if(/ie$/.test(v))return v.slice(0,-2)+'ying';
 if(/e$/.test(v)&&!/ee$/.test(v))return v.slice(0,-1)+'ing';
 const doubles=new Set(['sit','put','shut','cut','set','hit','bet','get','forget','begin','swim','run','dig','win']);
 return v+(doubles.has(v)?v.slice(-1):'')+'ing'
}
function subject(scene,pair,lang){
 if(pair)return lang==='en'?scene.nEn:scene.nEs;
 if(scene.p==='it')return lang==='en'?scene.nEn:scene.nEs;
 if(lang==='en')return PRON_EN[scene.p];
 if(scene.p==='they'&&/^Las\b/.test(scene.nEs))return'Ellas';
 return PRON_ES[scene.p]
}
function reflex(scene){return scene.refl?REFL_ES[scene.p]+' ':''}
function englishFirst(scene,tense,kind,pair){
 const sub=subject(scene,pair,'en'),qSub=low(sub),plural=!['he','she','it'].includes(scene.p),tail=' '+scene.tEn;
 let core='';
 if(tense==='present'){
  if(scene.en==='be'){
   if(kind===K.A)core=sub+' '+BE_EN.present[scene.p]+tail;
   if(kind===K.N)core=sub+' '+NEG_BE_EN.present[scene.p]+tail;
   if(kind===K.Q)core=cap(BE_EN.present[scene.p])+' '+qSub+tail
  }else{
   if(kind===K.A)core=sub+' '+(plural?scene.en:third(scene.en))+tail;
   if(kind===K.N)core=sub+' '+(plural?"don't":"doesn't")+' '+scene.en+tail;
   if(kind===K.Q)core=(plural?'Do':'Does')+' '+qSub+' '+scene.en+tail
  }
 }
 if(tense==='past'){
  const past=scene.en==='be'?BE_EN.past[scene.p]:scene.past;
  if(kind===K.A)core=sub+' '+past+tail;
  if(kind===K.N)core=scene.en==='be'?sub+' '+NEG_BE_EN.past[scene.p]+tail:sub+" didn't "+scene.en+tail;
  if(kind===K.Q)core=scene.en==='be'?cap(BE_EN.past[scene.p])+' '+qSub+tail:'Did '+qSub+' '+scene.en+tail
 }
 if(tense==='present-perfect'||tense==='past-perfect'){
  const aux=tense==='present-perfect'?(plural?'have':'has'):'had';
  if(kind===K.A)core=sub+' '+aux+' '+scene.part+tail;
  if(kind===K.N)core=sub+' '+(aux==='has'?"hasn't":aux==='have'?"haven't":"hadn't")+' '+scene.part+tail;
  if(kind===K.Q)core=cap(aux)+' '+qSub+' '+scene.part+tail
 }
 if(/continuous$/.test(tense)){
  let chain='';
  if(tense==='present-continuous')chain=BE_EN.present[scene.p];
  if(tense==='past-continuous')chain=BE_EN.past[scene.p];
  if(tense==='present-perfect-continuous')chain=(plural?'have':'has')+' been';
  if(tense==='past-perfect-continuous')chain='had been';
  const neg=chain==='is'?"isn't":chain==='are'?"aren't":chain==='am'?'am not':chain==='was'?"wasn't":chain==='were'?"weren't":chain==='has been'?"hasn't been":chain==='have been'?"haven't been":"hadn't been";
  if(kind===K.A)core=sub+' '+chain+' '+ing(scene.en)+tail;
  if(kind===K.N)core=sub+' '+neg+' '+ing(scene.en)+tail;
  if(kind===K.Q){
   const first=chain.split(' ')[0],rest=chain.split(' ').slice(1).join(' ');
   core=cap(first)+' '+qSub+(rest?' '+rest:'')+' '+ing(scene.en)+tail
  }
 }
 return core+(kind===K.Q?'?':'.')
}
function spanishFirst(scene,tense,kind,pair){
 const sub=subject(scene,pair,'es'),tail=' '+scene.tEs,neg=kind===K.N?'no ':'',refl=reflex(scene);
 let core='';
 if(tense==='present')core=sub+' '+neg+refl+scene.es[0]+tail;
 if(tense==='past')core=sub+' '+neg+refl+scene.es[1]+tail;
 if(tense==='present-perfect'||tense==='past-perfect'){
  const when=tense==='present-perfect'?'present':'past';
  core=sub+' '+neg+refl+HAVE_ES[when][scene.p]+' '+scene.es[2]+tail
 }
 if(/continuous$/.test(tense)){
  let chain='';
  if(tense==='present-continuous')chain=BE_ES.present[scene.p];
  if(tense==='past-continuous')chain=BE_ES.past[scene.p];
  if(tense==='present-perfect-continuous')chain=HAVE_ES.present[scene.p]+' estado';
  if(tense==='past-perfect-continuous')chain=HAVE_ES.past[scene.p]+' estado';
  core=sub+' '+neg+refl+chain+' '+scene.es[3]+tail
 }
 return kind===K.Q?'¿'+core+'?':core+'.'
}
function addPair(scene,en,es,pair,kind,tense){
 if(!pair)return{en,es};
 const pastStory=tense==='past'||tense==='past-perfect'||tense==='past-continuous'||tense==='past-perfect-continuous';
 if(kind===K.N&&scene.negativeStory){
  return{
   en:en+' '+(pastStory?scene.negativeStory.pastEn:scene.negativeStory.presentEn),
   es:es+' '+(pastStory?scene.negativeStory.pastEs:scene.negativeStory.presentEs)
  }
 }
 if(scene.meltStory){
  if(kind===K.N){
   return{en:en+' '+(pastStory?'The table was clean.':'The table is clean.'),es:es+' '+(pastStory?'La mesa estaba limpia.':'La mesa está limpia.')}
  }
  return{en:en+' '+(pastStory?'Everything was sticky.':'Everything is sticky.'),es:es+' '+(pastStory?'Todo estaba pegajoso.':'Todo está pegajoso.')}
 }
 const be=BE_EN.present[scene.p],beEs=SER_DESCRIPTORS.has(scene.dEn)?SER_ES[scene.p]:BE_ES.present[scene.p];
 if(kind===K.N){
  return{
   en:en.replace(/\.$/,'')+', but '+low(PRON_EN[scene.p])+' '+be+' '+scene.dEn+'.',
   es:es.replace(/\.$/,'')+', pero '+beEs+' '+scene.dEs+'.'
  }
 }
 return{en:en+' '+PRON_EN[scene.p]+' '+be+' '+scene.dEn+'.',es:es+' '+cap(beEs)+' '+scene.dEs+'.'}
}
function mission(scene,tense,kind,form,pair,round,position){
 const firstEn=englishFirst(scene,tense,kind,pair),firstEs=spanishFirst(scene,tense,kind,pair),both=addPair(scene,firstEn,firstEs,pair,kind,tense);
 return{
  id:'annual-r'+String(round+1).padStart(2,'0')+'-m'+String(position+1).padStart(2,'0')+'-'+scene.id.replace('-','_'),
  verbId:scene.id,verb:scene.en,form,tense:TENSES.find(t=>t.id===tense).name,tenseId:tense,kind,pair,es:both.es,en:both.en
 }
}
const MODIFIERS={
 present:[['every day','cada día']],
 past:[['yesterday','ayer']],
 'present-perfect':[['this week','esta semana']],
 'past-perfect':[['before lunch','antes del almuerzo']],
 'present-continuous':[['now','ahora']],
 'past-continuous':[['at six','a las seis']],
 'present-perfect-continuous':[['this week','esta semana']],
 'past-perfect-continuous':[['before dinner','antes de cenar']]
};
function insertBeforeFirstEnd(text,addition){
 const index=String(text).search(/[.?]/);
 return index<0?text+' '+addition:text.slice(0,index)+' '+addition+text.slice(index)
}
function makeUnique(q,seen){
 let count=Math.max(seen.get('en:'+q.en)||0,seen.get('es:'+q.es)||0);
 while(count){
  const options=MODIFIERS[q.tenseId],choice=options[(count-1)%options.length];
  q.en=insertBeforeFirstEnd(q.en,choice[0]);
  q.es=insertBeforeFirstEnd(q.es,choice[1]);
  count=Math.max(seen.get('en:'+q.en)||0,seen.get('es:'+q.es)||0)
 }
 seen.set('en:'+q.en,1);seen.set('es:'+q.es,1);return q
}
function pickRemaining(list,used,predicate){
 let index=list.findIndex(scene=>!used.has(scene.id)&&(!predicate||predicate(scene)));
 if(index<0)return null;
 return list.splice(index,1)[0]||null
}
function makeSlots(round){
 const slots=[];
 for(let i=0;i<4;i++)slots.push({tense:'past',kind:K.A,form:'past'});
 slots.push({tense:'past',kind:K.N,form:'base'},{tense:'past',kind:K.Q,form:'base'});
 slots.push({tense:'present',kind:K.A,form:'base'},{tense:'present',kind:K.N,form:'base'},{tense:'present',kind:K.N,form:'base'},{tense:'present',kind:K.Q,form:'base'},{tense:'present',kind:K.Q,form:'base'});
 slots.push({tense:'present-perfect',kind:K.A,form:'part'},{tense:'present-perfect',kind:K.N,form:'part'},{tense:'present-perfect',kind:K.Q,form:'part'});
 slots.push({tense:'past-perfect',kind:K.A,form:'part'},{tense:'past-perfect',kind:K.N,form:'part'},{tense:'past-perfect',kind:K.Q,form:'part'});
 const ct=['present-continuous','past-continuous','present-perfect-continuous','past-perfect-continuous'];
 const ck=[K.A,K.N,K.N,K.N,K.Q,K.Q,K.Q];
 for(let i=0;i<7;i++)slots.push({tense:ct[(i+round)%4],kind:ck[(i+round)%7],form:'review',continuous:true});
 return slots
}
function buildRounds(){
 const remain={
  past:S.slice(),
  base:S.slice(35).concat(S.slice(0,35)),
  part:S.slice(70).concat(S.slice(0,70))
 };
 const progressive=S.filter(scene=>!scene.noProgress),rounds=[],reviewState={all:0,progress:0},seen=new Map(),allPersons=['I','you','he','she','it','we','they'];
 for(let r=0;r<27;r++){
  const used=new Set(),slots=makeSlots(r),assigned=[];
  slots.forEach(slot=>{
   let scene=null,form=slot.form;
   if(form!=='review'&&remain[form].length){
    let predicate=null;
    // En una afirmativa de presente, he/she/it escondería la primera forma
    // con una -s. Reservamos aquí I/you/we/they para que la forma se vea.
    if(form==='base'&&slot.tense==='present'&&slot.kind===K.A){
     predicate=candidate=>['I','you','we','they'].includes(candidate.p)||candidate.en==='be'
    }
    scene=pickRemaining(remain[form],used,predicate)
   }
   if(!scene){
    const pool=slot.continuous?progressive:S;
    const key=slot.continuous?'progress':'all';
    for(let tries=0;tries<pool.length;tries++){
     const candidate=pool[reviewState[key]++%pool.length];
     if(!used.has(candidate.id)){scene=candidate;break}
    }
    if(!scene)scene=pool[reviewState[key]++%pool.length];
    form='review'
   }
   used.add(scene.id);assigned.push({slot,scene,form})
  });
  const missing=allPersons.filter(person=>!assigned.some(item=>item.scene.p===person));
  missing.forEach(person=>{
   const counts=assigned.reduce((out,item)=>(out[item.scene.p]=(out[item.scene.p]||0)+1,out),{});
   const replaceIndex=assigned.findIndex(item=>item.form==='review'&&counts[item.scene.p]>1);
   if(replaceIndex<0)return;
   const old=assigned[replaceIndex],pool=(old.slot.continuous?progressive:S).filter(scene=>scene.p===person&&!used.has(scene.id));
   if(!pool.length)return;
   used.delete(old.scene.id);old.scene=pool[(r+replaceIndex)%pool.length];used.add(old.scene.id)
  });
  const order=Array.from({length:24},(_,i)=>(i*7+r)%24);
  const pairIndexes=assigned.map((item,i)=>item.slot.kind===K.A?i:-1).filter(i=>i>=0);
  order.forEach(i=>{
   if(pairIndexes.length<12&&assigned[i].slot.kind===K.N&&!['I','you'].includes(assigned[i].scene.p)&&!pairIndexes.includes(i))pairIndexes.push(i)
  });
  order.forEach(i=>{
   if(pairIndexes.length<12&&assigned[i].slot.kind===K.N&&!pairIndexes.includes(i))pairIndexes.push(i)
  });
  const missions=assigned.map((item,i)=>makeUnique(mission(item.scene,item.slot.tense,item.slot.kind,item.form,pairIndexes.includes(i),r,i),seen));
  rounds.push(missions)
 }
 return rounds
}

const ROUNDS=buildRounds();
const GLOSS=Object.assign({},EXTRA_GLOSS);
S.forEach(scene=>{
 const meaning=VERB_MEANINGS[scene.en]||scene.en;
 [scene.en,scene.past,scene.part,ing(scene.en),third(scene.en)].forEach(word=>GLOSS[String(word).toLowerCase()]=meaning)
});
Object.assign(GLOSS,{
 have:'tener / he, hemos, han',has:'tiene / ha',had:'tuvo / había',do:'hacer',does:'hace / abre una pregunta',
 did:'hizo / marca el pasado',done:'hecho',lay:'poner / se tumbó',be:'ser / estar',been:'estado'
});

window.YO_SOLO_SCENES=S;
window.YO_SOLO_ROUNDS=ROUNDS;
window.YO_SOLO_GLOSS=GLOSS;
window.YO_SOLO_TENSES=TENSES;
})();
