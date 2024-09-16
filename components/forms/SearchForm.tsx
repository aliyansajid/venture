import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { z } from "zod";

const SearchForm = () => {
  const formSchema = z.object({
    search: z.string().min(3, "Please enter atleast 3 charcters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: any) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="search"
          placeholder="Search"
          iconSrc="/icons/MagnifyingGlass.svg"
          iconAlt="Magnifying Glass"
        />
      </form>
    </Form>
  );
};

export default SearchForm;
