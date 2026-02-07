<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary' // primary, danger, outline, ghost
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="isLoading"
    class="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/20': variant === 'primary',
      'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white': variant === 'danger',
      'bg-transparent border border-dark-border text-text-main hover:border-brand-primary hover:text-brand-primary': variant === 'outline',
      'bg-transparent text-text-muted hover:text-text-main hover:bg-dark-surface': variant === 'ghost'
    }"
  >
    <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <slot />
  </button>
</template>