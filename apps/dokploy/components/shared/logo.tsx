import { cn } from "@/lib/utils";

interface Props {
	className?: string;
	logoUrl?: string;
}

export const Logo = ({ className = "size-14", logoUrl }: Props) => {
	if (!logoUrl) {
		return null;
	}

	return (
		<img
			src={logoUrl}
			alt="Organization Logo"
			className={cn(className, "object-contain rounded-sm")}
		/>
	);
};
