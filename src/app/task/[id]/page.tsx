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
  addDoc
} from 'firebase/firestore';
import { TextArea } from '@/components/textArea';

import {useState,ChangeEvent,FormEvent} from 'react';
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
export default function Task({params}:TaskProps){
  const {id} = params;

  const {data: session} = useSession();
  const [tasks,setTasks] = useState({});
  const [comentarios,setComentarios] = useState('');
  
  console.log(comentarios);

  const docRef = doc(db,"tarefas",id);

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
        taskid:task.taskId,

       })

       setComentarios('')
    } catch (error) {
      console.log(error);
    }
  }

  console.log(task);

  return (
    <div className={styles.container}>
    <main className={styles.main}>
    <h1>Tarefa</h1>
    <article className={styles.task}>
      <p>
        {task?.tarefa}
      </p>
    </article>
    </main>

    <section className={styles.commentscontainer}>
      <h2>Deixar comentários</h2>

      <form action="" onSubmit={handleComment} >
        <TextArea 
        placeholder='Digite seu comentário...'
        value={comentarios}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComentarios(e.target.value)}
        />
        <button className={styles.button}
        disabled={!session?.user}
        >
          Enviar
        </button>
      </form>
    </section>
    </div>
  )
}
