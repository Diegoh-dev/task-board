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

export const metadata = {
  title: "Meu painel de tarefas",
  description: "painel de tarefas",
};
export default function Dashboard() {
  //VER OUTRA FORMA DE FAZER 
  const { data: session } = useSession();

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

              <form action="">
                <TextArea placeholder="Digite qual a sua tarefa" />

                <div className={styles.checkBoxArea}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className={styles.checkBox}
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

            <article className={styles.task}>
              <div className={styles.tagContainer}>
                <label className={styles.tag} htmlFor="">
                  PUBLICO
                </label>
                <button className={styles.shareButton}>
                  <FiShare2 size={22} color="#3183ff"/>
                </button>
              </div>

              <div className={styles.taskContent}>
                <p>MInha Primeira tarefa de exemplo!</p>

                <button className={styles.trashButton}>
                  <FaTrash size="24" color="#ea3140"/>
                </button>
              </div>
            </article>
          </section>
        </main>
      )}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  console.log({context})

  console.log('teste');
  const session = await getSession(context);
  return {
    props: { session },
  };
}
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

// export async function getServerSideProps(context:any) {
//   const session = await getSession(context)

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {
//       session,
//     },
//   }
// }

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
