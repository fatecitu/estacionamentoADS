import './style.css'
import { supabase } from './supabase.js'

const loginForm = document.getElementById('login-form')
const messageDiv = document.getElementById('message')
//listener do Submit
loginForm.addEventListener('submit', async(e) => {
    e.preventDefault() //evita o recarregamento
    //obtendo o conteúdo dos campos
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    //tentaremos fazer o login no Supabase
    const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if(error){
        messageDiv.innerText = `Erro: ${error.message}`
        messageDiv.classList.remove('hidden') //mostramos
    } else {
        //se deu certo, vamos encaminhar para o menu
        window.location.assign('./menu.html')
    }
})

