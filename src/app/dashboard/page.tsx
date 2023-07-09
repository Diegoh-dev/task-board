import Head from 'next/head';
import styles from './dashboard.module.scss';

export const metadata = {
  title: 'Meu painel de tarefas',
  description: 'painel de tarefas',
}
export default function Dashboard(){
  return (
    <div className={styles.container}>
      <h1>Pagina painel</h1>
    </div>
  )
}