<template>
  <Suspense>
    <template #default>
      <div>Home View</div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
// TODO: add logic
</script> 