<template>
  <div font-sans text="center gray-700 dark:gray-200">
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer></Footer>
  </div>
</template>
<style scoped lang="scss">
main{
  min-height: calc(100vh - 3.75rem - 3.75rem);
}
</style>