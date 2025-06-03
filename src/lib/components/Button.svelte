<script lang="ts">
	import type { Snippet } from "svelte";



type Props = {
    onClick?: () => void;
    ariaLabel?: string;
    color?: 'default' | 'primary' | 'secundary';
    type?: 'submit' | 'reset' | 'button' | null;
    disabled?: boolean;
    loading?: boolean;
    form?: string;
    leftIcon?: Snippet;
    children?: Snippet;
};

let {
    children,
    onClick = () => {},
    type = 'button',
    color = 'default',

}: Props = $props();

</script>