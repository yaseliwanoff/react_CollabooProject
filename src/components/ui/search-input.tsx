import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  image?: string;
}

const Input: React.FC<InputProps> = ({ className, type, image, ...props }) => {
  return (
    <div className="relative flex items-center">
      {image && (
        <img
          src={image}
          alt=""
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" // Позиционируем изображение
        />
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "border-input w-[484px] file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 min-w-0 rounded-md border bg-transparent px-10 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", // Увеличиваем отступ слева для учета изображения
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
    </div>
  );
};

export { Input };
