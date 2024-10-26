<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue';
 
const modelValue = defineModel();
interface BaseInputProps {
    label: string;
}
 
const props = withDefaults(defineProps<BaseInputProps>(), {
    label: ''
});
 
const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void;
}>();
 
function updateValue(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement)?.value);
}
</script>
 
<template>
    <label v-if="props.label">{{ props.label }}</label>
    <input
        class="mb-6"
        :placeholder="props.label"
        :value="modelValue"
        @input="updateValue($event)"
        v-bind="$attrs"
    />
</template>