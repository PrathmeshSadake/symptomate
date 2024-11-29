import { FormProvider } from "@/context/form-context";
import SymptomChecker from "@/components/symptom-checker";

export default function Page() {
  return (
    <FormProvider>
      <SymptomChecker />
    </FormProvider>
  );
}
