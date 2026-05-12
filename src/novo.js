import './style.css'
import { supabase } from './supabase.js'

const signupForm = document.getElementById('signup-form')
const messageDiv = document.getElementById('message')

const showMessage = (text, type = 'error') => {
  messageDiv.innerText = text
  messageDiv.className = `mt-4 text-center text-sm ${
    type === 'success' ? 'text-green-600' : 'text-red-500'
  }`
}

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const confirmPassword = document.getElementById('confirm-password').value

  if (password !== confirmPassword) {
    showMessage('As senhas nao conferem.')
    return
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    showMessage(`Erro: ${error.message}`)
    return
  }

  showMessage('Usuario cadastrado com sucesso. Verifique seu e-mail, se necessario.', 'success')
  signupForm.reset()
})
