"use client";
import { motion, type Variants } from "framer-motion";
import { PropsWithChildren } from "react";

const fadeInVariants: Variants = {
	initial: { opacity: 0, y: 8 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FadeIn(props: PropsWithChildren<{ as?: keyof JSX.IntrinsicElements; delay?: number }>) {
	const { as = "div", delay = 0, children } = props;
	const Comp: any = motion[as as any] ?? motion.div;
	return (
		<Comp initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInVariants} transition={{ delay }}>
			{children}
		</Comp>
	);
}

export function SlideUp(props: PropsWithChildren<{ as?: keyof JSX.IntrinsicElements; delay?: number }>) {
	const { as = "div", delay = 0, children } = props;
	const Comp: any = motion[as as any] ?? motion.div;
	return (
		<Comp initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay }}>
			{children}
		</Comp>
	);
}

export function Stagger(props: PropsWithChildren<{ gap?: string }>) {
	return (
		<motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
			variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
			style={{ display: "grid", gap: props.gap ?? "0.75rem" }}>
			{props.children}
		</motion.div>
	);
}
