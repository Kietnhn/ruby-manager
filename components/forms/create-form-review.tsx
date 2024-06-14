"use client";

import CardWrapper from "../ui/card-wrapper";
import {
    Button,
    RadioGroup,
    Radio,
    Checkbox,
    Divider,
    Card,
    Avatar,
    cn,
    Image,
} from "@nextui-org/react";
import DefaultInput from "../ui/default-input";
import DefaultTextArea from "../ui/default-textarea";
import { FullProduct } from "@/lib/definitions";
import useRating from "@/hooks/useRating";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createReview } from "@/lib/actions/review";
import StarRating from "../products/star-rating";

interface ImagePreview {
    file: File;
    url: string;
}
export default function CreateFormReview({
    product,
    selectedColor,
}: {
    product: FullProduct;
    selectedColor: string;
}) {
    const { rating, hoverRating, setRating, setHoverRating, resetHoverRating } =
        useRating(0, 5);
    const currentGallery =
        product.gallery.find((item) => item.color === selectedColor) ||
        product.gallery[0];

    const [isAgree, setIsAgree] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<ImagePreview[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const initialState = { message: null, errors: {} };
    const createReviewWithData = createReview.bind(null, product.id);

    // @ts-ignore
    const [state, dispatch] = useFormState(createReviewWithData, initialState);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (selectedFiles.length + files.length > 5) {
            setIsError(true);
            return;
        }
        setSelectedFiles([...selectedFiles, ...files]);
        setIsError(false);
    };
    const handleAddImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleRemoveImage = (index: number) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles.splice(index, 1);
        setSelectedFiles(newSelectedFiles);

        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };
    useEffect(() => {
        const newPreviews = selectedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setPreviews(newPreviews);

        // Clean up URLs after component unmount
        return () => {
            newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [selectedFiles]);

    return (
        <form action={dispatch} className="flex flex-col gap-6">
            <div className=" flex gap-4 items-start">
                <Avatar
                    src={currentGallery.image}
                    radius="sm"
                    size="lg"
                    isBordered
                />
                <h3>{product.name}</h3>
            </div>
            <div className="flex flex-col gap-2">
                <h3>Overall rating</h3>
                <input
                    type="number"
                    value={rating}
                    name="rating"
                    className="hidden"
                />
                <StarRating
                    rating={rating}
                    hoverRating={hoverRating}
                    setRating={setRating}
                    setHoverRating={setHoverRating}
                    resetHoverRating={resetHoverRating}
                />

                {state?.errors.rating && (
                    <p className="text-red-500 text-xs">
                        {state.errors.rating?.at(0)}
                    </p>
                )}
            </div>
            <Divider />

            <DefaultInput
                name="heading"
                label="Review title"
                description="Summarise your review in 150 characters or less."
                placeholder="Enter title here..."
                errorMessage={state?.errors.heading?.at(0)}
            />
            <DefaultTextArea
                name="content"
                label="Your review"
                description="Describe what you liked, what you didn't like and other key things shoppers should know. Minimum 30 characters."
                placeholder="Enter your review here..."
                minRows={5}
                errorMessage={state?.errors.content?.at(0)}
            />
            <Divider />

            <RadioGroup
                label="Would you recommend this product? "
                name="isRecommend"
                defaultValue={"true"}
            >
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
            </RadioGroup>
            <Divider />

            <div className="flex flex-col gap-4 ">
                <div className="">
                    <h3>Share your photos (Options)</h3>
                    <p
                        className={cn(
                            "text-foreground-500",
                            isError && "text-red-500"
                        )}
                    >
                        Add up to 5 photos that show how you wear and style this
                        product.
                    </p>
                </div>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    name="images"
                    ref={fileInputRef}
                />
                <div className="flex flex-wrap space-x-2">
                    {previews.map((preview, index) => (
                        <div key={index} className="w-32 h-32 relative">
                            <Image
                                src={preview.url}
                                alt={`Preview ${index + 1}`}
                                className="object-cover w-full h-full rounded-lg"
                            />
                            <Button
                                isIconOnly
                                size="sm"
                                radius="full"
                                className="absolute top-1 right-1 z-20"
                                onClick={() => handleRemoveImage(index)}
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    ))}
                    {previews.length < 5 && (
                        <Card
                            isPressable
                            shadow="none"
                            onClick={handleAddImageClick}
                            className="w-32 aspect-square flex-center border hover:cursor-pointer rounded-medium"
                        >
                            <PlusIcon className="w-8 h-8" />
                        </Card>
                    )}
                </div>
            </div>
            <Divider />

            <Checkbox
                name="agree"
                isSelected={isAgree}
                onValueChange={setIsAgree}
            >
                By ticking the tick box, I agree to the Privacy Policy, Terms of
                Use and Terms of Service
            </Checkbox>

            <div className="flex flex-col gap-2">
                {state?.message && (
                    <p className="text-red-500 text-xs">{state.message}</p>
                )}
                <SubmitButton isAgree={isAgree} />
            </div>
        </form>
    );
}
function SubmitButton({ isAgree }: { isAgree: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button
            color="primary"
            isDisabled={!isAgree || pending}
            // onPress={onClose}
            type="submit"
            className="w-full"
        >
            Submit
        </Button>
    );
}
