import {
    Card,
    CardBody,
    CardHeader,
    CardProps,
    Divider,
} from "@nextui-org/react";

interface Props extends CardProps {
    heading?: string;
}
export default function CardWrapper(props: Props) {
    const { heading, children, ...rest } = props;
    return (
        <Card classNames={{ body: "flex flex-col gap-4" }} {...rest}>
            {heading && (
                <>
                    <CardHeader className="text-xl font-semibold">
                        {heading}
                    </CardHeader>
                    <Divider />
                </>
            )}
            <CardBody>{children}</CardBody>
        </Card>
    );
}
