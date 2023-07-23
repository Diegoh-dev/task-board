import { HtmlProps } from 'next/dist/shared/lib/html-context';
import styles from './styles.module.scss';
import { HTMLProps } from 'react';

export function TextArea({...rest}:HTMLProps<HTMLTextAreaElement>){
  return <textarea className={styles.textArea} {...rest}>
    
  </textarea>
}