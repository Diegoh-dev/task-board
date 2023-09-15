import Image from 'next/image';
import styles from './page.module.scss';
import hero from '../../public/assets/hero.png';
import { Roboto } from 'next/font/google';
import {
  collection,
  getDocs
} from 'firebase/firestore';

import {db} from '../services/firebaseConnection';
import {cache} from 'react'; //A função React cacheé usada para memorizar solicitações de dados.

export const revalidate = 3600 // revalidate the data at most every hour
 

const roboto = Roboto({weight:['400','500','700'],subsets:['latin']})

export default async function Home() {

  // async function getSize(){
  //   const comentarios = collection(db,'comentarios');
  //   const posts = collection(db,'tarefas');
  
  //   const comentariosSnapshot = await getDocs(comentarios);
  //   const postSnapshot = await getDocs(posts);

   

  //   const result = {
  //     posts:postSnapshot.size || 0,
  //     comentarios: comentariosSnapshot.size || 0
  //   }
  
  //   // return {
  //   //   posts:postSnapshot.size || 0,
  //   //   comentarios: comentariosSnapshot.size || 0
  //   // }
  // // }

  const result = await getSize();

  // console.log('result:',result)


  return (
    <main className={`${roboto.className} ${styles.main}`}>
      <div className={styles.containerHero}>
        <Image
        className={styles.heroImage}
        src={hero}
        alt='hero'
        priority
       
        />

        <h1>Sistema feito para você organizar <br/> seus estudos e tarefas.</h1>

        <div className={styles.containerSection}>
        <section className={styles.sectionsDados}>
          +{result.posts} posts
        </section>
        <section className={styles.sectionsDados}>
          +{result.comentarios} comentários
        </section>
      </div>
      </div>

    
    </main>
  )
}


export const getSize = cache(async () => {
  const comentarios = collection(db, "comentarios");
  const posts = collection(db, "tarefas");

  const comentariosSnapshot = await getDocs(comentarios);
  const postSnapshot = await getDocs(posts);

  return {
    posts: postSnapshot.size || 0,
    comentarios: comentariosSnapshot.size || 0,
  };
});