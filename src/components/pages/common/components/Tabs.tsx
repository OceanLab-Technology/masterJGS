import AnimatedBackground from "@/components/ui/animated-tabs";

export default function Tabs({ options }: { options: string[] }) {
  return (
      <div className="rounded-[8px] bg-gray-100 p-[2px] dark:bg-zinc-800">
        <AnimatedBackground
          defaultValue="Day"
          className="rounded-lg bg-white dark:bg-zinc-700"
          transition={{
            ease: "easeInOut",
            duration: 0.2,
          }}
        >
          {/* {["Day", "Week", "Month", "Year"].map((label, index) => { */}
          {options.map((label, index) => {
            return (
              <button
                key={index}
                data-id={label}
                type="button"
                className="inline-flex w-20 items-center justify-center text-center text-zinc-800 transition-transform active:scale-[0.98] dark:text-zinc-50"
              >
                {label}
              </button>
            );
          })}
        </AnimatedBackground>
      </div>
  );
}


// import AnimatedBackground from "@/components/ui/animated-tabs";

// export default function Tabs({ options }: { options: string[] }) {
//   return (
//     <div className="rounded-[8px] bg-[--color-muted] p-[2px] dark:bg-[--color-muted]">
//       <AnimatedBackground
//         defaultValue="Day"
//         className="rounded-lg bg-[--color-background] dark:bg-[--color-background]"
//         transition={{
//           ease: "easeInOut",
//           duration: 0.2,
//         }}
//       >
//         {options.map((label, index) => {
//           return (
//             <button
//               key={index}
//               data-id={label}
//               type="button"
//               className="inline-flex w-20 items-center justify-center text-center text-[--color-foreground] transition-transform active:scale-[0.98] dark:text-[--color-foreground]"
//             >
//               {label}
//             </button>
//           );
//         })}
//       </AnimatedBackground>
//     </div>
//   );
// }
