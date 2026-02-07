<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  error: String
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-xs font-bold uppercase tracking-widest text-text-muted px-1">
      {{ label }}
    </label>
    
    <div class="relative">
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="w-full px-4 py-3 bg-dark-surface border rounded-xl text-text-main outline-none transition-all placeholder:text-text-muted/50"
        :class="error 
          ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
          : 'border-dark-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'"
      />
    </div>

    <span v-if="error" class="text-xs text-red-500 px-1">{{ error }}</span>
  </div>
</template>