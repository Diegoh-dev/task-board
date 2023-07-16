"use client";
import Head from "next/head";
import styles from "./dashboard.module.scss";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOption } from "../api/auth/[...nextauth]/route";
import { getSession, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { signIn, signOut } from "next-auth/react";

export const metadata = {
  title: "Meu painel de tarefas",
  description: "painel de tarefas",
};
export default function Dashboard({ res }: any) {
  const { data: session } = useSession();

  return (
    <>
      {!session?.user ? (
        <div style={{
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          gap:'1rem',
          justifyContent:'center',
          height:'calc(100vh - 76px)'
        }}>
          <h1>Você precisa fazer login</h1>
          {/* <button className={styles.loginButton} onClick={() => signIn()}>Acessar</button> */}
        </div>
      ) : (
        <div className={styles.container}>
          <h1>Pagina painel</h1>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context: any) {
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
