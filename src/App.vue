<template>
  <div font-sans text="gray-700 dark:gray-200">
    <Navbar />
    <main class="mt-24">
      <router-view />
    </main>
    <Footer></Footer>
  </div>
</template>

<style scoped lang="scss">
main{
  min-height: calc(100vh - 3.75rem - 4.25rem);
}
</style>
