import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import Image from "next/image";
import { FormControl, FormItem, FormLabel } from "./ui/form";

const multiSelectVariants = cva(
  "mr-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-action-secondary-selected text-dark-primary text-sm font-medium px-2 py-1.5 gap-2 hover:bg-action-secondary-selected/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    profileImage?: string;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue: string[];
  label: string;
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      label,
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      setSelectedValues(defaultValue);
    }, [defaultValue]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    return (
      <FormItem>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Popover
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            modal={modalPopover}
          >
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                ref={ref}
                {...props}
                onClick={handleTogglePopover}
                className="w-full min-h-10 h-auto px-3 border-interaction-outline-base hover:bg-white"
              >
                {selectedValues.length > 0 ? (
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-wrap items-center">
                      {selectedValues.slice(0, maxCount).map((value) => {
                        const option = options.find((o) => o.value === value);
                        return (
                          <Badge
                            key={value}
                            className={cn(
                              isAnimating ? "animate-bounce" : "",
                              multiSelectVariants({ variant })
                            )}
                            style={{ animationDuration: `${animation}s` }}
                          >
                            <Image
                              src={
                                option?.profileImage || "/icons/UserCircle.svg"
                              }
                              alt={option?.label || "icon"}
                              width={24}
                              height={24}
                              className="object-cover w-6 h-6 rounded-full"
                            />
                            {option?.label}
                            <XCircle
                              size={16}
                              className="ml-2 cursor-pointer text-dark-secondary"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleOption(value);
                              }}
                            />
                          </Badge>
                        );
                      })}
                      {selectedValues.length > maxCount && (
                        <Badge
                          className={cn(
                            isAnimating ? "animate-bounce" : "",
                            multiSelectVariants({ variant })
                          )}
                          style={{ animationDuration: `${animation}s` }}
                        >
                          {`+ ${selectedValues.length - maxCount} more`}

                          <XCircle
                            size={16}
                            className="ml-2 cursor-pointer text-dark-secondary"
                            onClick={(event) => {
                              event.stopPropagation();
                              clearExtraOptions();
                            }}
                          />
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <XIcon
                        size={16}
                        className="cursor-pointer text-dark-secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClear();
                        }}
                      />
                      <Separator
                        orientation="vertical"
                        className="flex min-h-4 h-full"
                      />
                      <ChevronDown
                        size={16}
                        className="cursor-pointer text-dark-secondary"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-dark-tertiary font-normal">
                      {placeholder}
                    </span>
                    <ChevronDown
                      size={16}
                      className="text-dark-secondary cursor-pointer"
                    />
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto h-52 p-0"
              align="start"
              onEscapeKeyDown={() => setIsPopoverOpen(false)}
            >
              <Command>
                <CommandInput
                  placeholder="Search"
                  onKeyDown={handleInputKeyDown}
                />
                <CommandList>
                  <CommandEmpty>No result found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => toggleOption(option.value)}
                          className="cursor-pointer px-3"
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-dark-primary",
                              isSelected
                                ? "bg-action-primary-base text-white"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon size={16} />
                          </div>
                          <Image
                            src={option.profileImage || "/icons/UserCircle.svg"}
                            alt={option.label}
                            width={24}
                            height={24}
                            className="object-cover w-6 h-6 rounded-full "
                          />
                          <span>{option.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>

                  {selectedValues.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={handleClear}
                          className="justify-center text-center cursor-pointer"
                        >
                          Clear
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormControl>
      </FormItem>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
