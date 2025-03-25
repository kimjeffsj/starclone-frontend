import { UseFormReturn } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { ProfileFormInput } from "./validations/profile.schema";

interface EditProfileForm {
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  form: UseFormReturn<ProfileFormInput>;
  handleProfileUpdate: (values: ProfileFormInput) => void;
}

const EditProfileForm = ({
  isEditProfileOpen,
  setIsEditProfileOpen,
  form,
  handleProfileUpdate,
}: EditProfileForm) => {
  return (
    <AlertDialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profile</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleProfileUpdate)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourwebsite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <AlertDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProfileForm;
