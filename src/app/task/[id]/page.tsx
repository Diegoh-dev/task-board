'use client'
import styles from './styles.module.scss';
import {db} from '@/services/firebaseConnection';
import { redirect } from 'next/navigation'
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { TextArea } from '@/components/textArea';
import {FaTrash} from 'react-icons/fa'
import {useState,ChangeEvent,FormEvent,useEffect} from 'react';
import {useSession} from 'next-auth/react';

export const metadata = {
  title: "Detalhes da taerfa",
  description: "painel de tarefas",
};

interface TaskProps{
  params:{
    id:string;
  };
}

interface taskUnicaProps{
  tarefa:string;
  public:boolean;
  create:string;
  user:string;
  taskId:string;
}

interface ComentariosProps{
  id:string;
  comentario:string;
  taskId:string;
  user:string;
  name:string;
}
export default function Task({params,}:TaskProps){
  let allComentarios:ComentariosProps[] = [];

  console.log({allComentarios})

  const {id} = params;

  const {data: session} = useSession();
  const [tasks,setTasks] = useState({
    tarefa:'',
    public:false,
    create:'',
    user: '',
    taskId:'',
  });
  const [comentarios,setComentarios] = useState('');
  const [allComentariosTaks,setAllComentariosTaks] = useState<ComentariosProps[]>(allComentarios || []);
  const docRef = doc(db,"tarefas",id);


  const queryComentarios = query(collection(db,"comentarios"),where("taskid","==",id));

 async function getComentarios(){
   const snapshotComentarios  = await getDocs(queryComentarios);
   console.log({snapshotComentarios})

   snapshotComentarios.forEach((doc) => {
    allComentarios.push({
      id:doc.id,
      comentario:doc.data().comentario,
      user:doc.data().user,
      name:doc.data().name,
      taskId:doc.data().taskId
    })
   })

  }
  
  useEffect(()=>{
    getComentarios();
  },[])

  useEffect(()=>{
    async function getSnap(){
      const snapshot = await getDoc(docRef);
      if(!snapshot.data()){
        // usar o rediret no dashboard
        redirect('/');
      }
      if(!snapshot.data()?.public){
        redirect('/');
      }

      const mileseconds = snapshot.data()?.create?.seconds * 1000;

      const task : taskUnicaProps = {
        tarefa:snapshot.data()?.tarefa,
        public:snapshot.data()?.public,
        create: new Date(mileseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId:id,
      }

      setTasks(task)
    }

    getSnap()
  },[])

console.log({allComentariosTaks})



  async function handleComment(e:FormEvent){
    e.preventDefault();
    alert('Comentário enviado');
    if(comentarios === '') return
    if(!session?.user?.email || !session.user.name) return;

    try {
      //criar uma nova coleção no banco de dados;
       const docRef = await addDoc(collection(db,"comentarios"),{
        comentario:comentarios,
        create: new Date(),
        user:session?.user?.email,
        name:session?.user?.name,
        taskid:tasks.taskId,

       })

       setComentarios("");

       const data = {
        id:docRef.id,
        comentario:comentarios,
        taskId:tasks.taskId,
        user:session.user.email,
        name:session.user.name,
       }
//                            preveState = itens que existe no estado no momento.
       setAllComentariosTaks((oldItens) => [...oldItens,data]);
   
    } catch (error) {
      console.log(error);
    }
  }

  console.log(tasks);

  async function handleDeleteComment(id:string){
    try {
      const docRef = doc(db,"comentarios",id);
      await deleteDoc(docRef);
      alert('deletado');

      const deletComentarios = allComentariosTaks.filter((item)=> item.id !== id);

      setAllComentariosTaks(deletComentarios);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{tasks?.tarefa}</p>
        </article>
      </main>

      <section className={styles.commentscontainer}>
        <h2>Deixar comentários</h2>

        <form action="" onSubmit={handleComment}>
          <TextArea
            placeholder="Digite seu comentário..."
            value={comentarios}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setComentarios(e.target.value)
            }
          />
          <button className={styles.button} disabled={!session?.user}>
            Enviar
          </button>
        </form>
      </section>

      <section className={styles.commentscontainer}>
        <h2>Todos os comentários</h2>
        {allComentariosTaks.length === 0 && (
          <span>Nenhum comentário foi encontrado...</span>
        )}

        {allComentariosTaks.map((item) => (
          <article key={item.id} className={styles.comment}>
            <div className={styles.headComment}>
              <label className={styles.commentLabel}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button className={styles.buttonTrash}
                onClick={()=> {
                  handleDeleteComment(item.id);
                }}
                >
                  <FaTrash size={18} color="#EA3140" />
                </button>
              )}
            </div>
            <p>{item?.comentario}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
