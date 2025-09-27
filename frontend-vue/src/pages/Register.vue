<script setup lang="ts">
  import { GoalIcon } from "lucide-vue-next";
  import { reactive } from "vue";
  import { RouterLink, useRouter } from "vue-router";
  import Logo from "@/assets/vue.svg";

  const state = reactive({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  async function register({ name, email, password }: typeof state) {
    if (!name || !email || !password) {
      alert("Preencha todos os campos!");
      return false;
    }

    localStorage.setItem("token", "true");
    return true;
  }

  async function onSubmit() {
    const success = await register(state);
    if (success) {
      router.push("/dashboard");
    }
  }
</script>

<template>
  <div class="flex flex-col pb-4 h-[100vh] items-center justify-between">        
    <div class="flex mt-8">
      <img :src="Logo" alt="logo" class="w-16 h-16" />
    </div>
    
    <form @submit.prevent="onSubmit"
        class="flex flex-col w-full mb-8 px-8 py-12 gap-6 rounded-2xl sm:w-md sm:px-14 sm:py-10 sm:bg-[#ffffff19]"
    >
      <p class="text-3xl text-center text-white">Criar conta</p>

      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-bold text-gray-900 dark:text-white">Name</label>
          <input
            required
            v-model="state.name"
            type="text"
            placeholder="Digite seu nome"
            class="sm:w-full sm:bg-background text-white p-3 rounded-xl border-neutral-700 border-2 focus:outline-0 focus:border-white"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="block text-sm font-bold text-gray-900 dark:text-white">Email</label>
          <input
            required
            v-model="state.email"
            type="email"
            placeholder="example@company.com"
            class="sm:w-full sm:bg-background text-white p-3 rounded-xl border-neutral-700 border-2 focus:outline-0 focus:border-white"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="block text-sm font-bold text-gray-900 dark:text-white">Password</label>
          <input
            required
            v-model="state.password"
            type="password"
            placeholder="Sua senha"
            class="sm:w-full sm:bg-background text-white p-3 rounded-xl border-neutral-700 border-2 focus:outline-0 focus:border-white"
          />
        </div>
      </div>

      <button type="submit"
        class="w-full p-3 mt-4 rounded-lg cursor-pointer text-sm font-bold bg-[#e0e0e0] border-[#e0e0e0] text-[#767676] hover:bg-[#f1f1f1]"
      >
        Criar conta
      </button>

      <RouterLink to="/login" class="text-white text-center underline">
        Já tenho uma conta
      </RouterLink>

      <hr class="my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white" />

      <div class="flex items-center justify-center">
        <button class="flex w-64 gap-2 p-2 justify-evenly cursor-pointer text-sm font-bold bg-[#e0e0e0] border-[#e0e0e0] text-[#767676] hover:bg-[#f1f1f1]">
          <GoalIcon class="w-5 h-5" />
          Acessar conta com Google
        </button>
      </div>
    </form>

    <div>
      <p class="flex text-sm">
        Este site é protegido por reCAPTCHA e o Google.
        São aplicados os&nbsp;<a href="#" class="underline">Termos de serviço</a>&nbsp;e a&nbsp;<a href="#" class="underline">Política de privacidade</a>.
      </p>
    </div>
  </div>
</template>
