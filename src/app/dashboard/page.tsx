"use client";
import Head from "next/head";
import styles from "./dashboard.module.scss";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOption } from "../api/auth/[...nextauth]/route";
import { getSession, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { signIn, signOut } from "next-auth/react";
import { TextArea } from "@/components/textArea";
import {FiShare2} from 'react-icons/fi';
import {FaTrash} from 'react-icons/fa';
import {ChangeEvent, FormEventHandler, useState,FormEvent, useEffect } from "react";
import {db} from '@/services/firebaseConnection';
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc
} from 'firebase/firestore';
import Link from "next/link";

export const metadata = {
  title: "Meu painel de tarefas",
  description: "painel de tarefas",
};

interface DashBoadProps {
  user:{
    email:string;
  }
}

interface taskProps {
  id: string;
  create: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard() {

  //VER OUTRA FORMA DE FAZER 
  const { data: session } = useSession();

  const [tarefa,setTarefa] = useState('');
  const [publicTask,setPublicTask] = useState(false);

  const [task,setTask] = useState<taskProps[]>([]);

  function handleCkeck(e:ChangeEvent<HTMLInputElement>){
    setPublicTask(e.target.checked);
  }

 async function handleRegisterTask(e:FormEvent){
    e.preventDefault();

    if(tarefa === '') return;

    try {
     await addDoc(collection(db,"tarefas"),{
      tarefa:tarefa,
      create: new Date(),
      user: session?.user?.email,
      public: publicTask,
     });

     setPublicTask(false);
     setTarefa('');
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() =>{
    async function loadTarefas() {
      const tarefasref = collection(db, "tarefas");

      const q = query(tarefasref,
        orderBy("create","desc"),
        where("user", "==", session?.user?.email)
        )

       onSnapshot(q,(snapshot)=> {
        let lista = [] as taskProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa:doc.data().tarefa,
            create:doc.data().create,
            user:doc.data().user,
            public:doc.data().public
          })
        })

        setTask(lista);
        })
    }

    loadTarefas();
  },[session?.user?.email]);

 async function handleShare(id:string){
    //copiar
  await navigator.clipboard.writeText(
    `${process.env.NEXT_PUBLIC_URL}/task/${id}`
  )
  // COLOCAR O TOASFY
  alert('URL copiada com sucesso!')
  }

  async function handleDeletetask(id:string){
    const docRef = doc(db,"tarefas",id);
    await deleteDoc(docRef);
  }

  return (
    <div className={styles.container}>
      {!session?.user ? (
        <div className={styles.notAutenticado}>
          <h1>Você precisa fazer login</h1>
          {/* <button className={styles.loginButton} onClick={() => signIn()}>Acessar</button> */}
        </div>
      ) : (
        <main className={styles.main}>
          <section className={styles.content}>
            <div className={styles.contentform}>
              <h1 className={styles.title}>Qual a sua tarefa</h1>

              <form action="" onSubmit={handleRegisterTask}>
                <TextArea
                  placeholder="Digite qual a sua tarefa"
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setTarefa(e.target.value)
                  }
                  value={tarefa}
                />

                <div className={styles.checkBoxArea}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className={styles.checkBox}
                    onChange={handleCkeck}
                    checked={publicTask}
                  />
                  <label htmlFor="">Deixar tarefa publica?</label>
                </div>

                <button className={styles.button} type="submit">
                  Registrar
                </button>
              </form>
            </div>
          </section>

          <section className={styles.taskContainer}>
            <h1>Minhas tarefas</h1>

            <div
            style={{
              maxWidth:' 1024px',
              width: '100%',
              padding: '0 18px 28px 18px',
              marginTop: '58px'
            }}
            >
            {task.map((tarefa, index) => (
              <article key={tarefa.id} className={styles.task}>
                {tarefa.public && (
                  <div className={styles.tagContainer}>
                    <label className={styles.tag} htmlFor="">
                      PUBLICO
                    </label>
                    <button className={styles.shareButton} onClick={() => handleShare(tarefa.id)}>
                      <FiShare2 size={22} color="#3183ff" />
                    </button>
                  </div>
                )}

                <div className={styles.taskContent}>
                  <p>{tarefa.tarefa}</p>

                  {tarefa.public ? (
                    <Link href={`/task/${tarefa.id}`}>
                      <p>{tarefa.tarefa}</p>
                    </Link>
                  ) : (
                    <p>{tarefa.tarefa}</p>
                  )}

                  <button className={styles.trashButton} onClick={()=> handleDeletetask(tarefa.id)}>
                    <FaTrash size="24" color="#ea3140" />
                  </button>
                </div>
              </article>
            ))}
            </div>

          
          </section>
        </main>
      )}
    </div>
  );
}

// export async function getServerSideProps(context: any) {
//   console.log({context})

//   console.log('teste');
//   const session = await getSession(context);
//   return {
//     props: { },
//   };
// }
// export async function getServerSideProps(context:any) {
//   console.log('context:',context)
//   return {
//     props: {
//       session: await getServerSession(
//         context.req,
//         context.res,
//         authOption
//       ),
//     },
//   }
// }

export async function getServerSideProps(context:any) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user:{
        email:session.user?.email,
      }
    },
  }
}

// export const getServerSideProps:GetServerSideProps = async (context) => {

//   const session = await getSession(context);

//   console.log(session)

//   if(!session?.user){
//     return{
//       redirect:{
//         destination:'/unauthenticated',
//         permanent:false
//       }
//     }
//   }

//   return {
//     props: {session},
//   };
// }
