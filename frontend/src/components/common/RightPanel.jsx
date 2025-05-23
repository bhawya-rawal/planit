import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
	const { data: suggestedUsers, isLoading: isLoadingUsers } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	const { data: leaderboardUsers, isLoading: isLoadingLeaderboard } = useQuery({
		queryKey: ["leaderboard"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/leaderboard");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	const { follow, isPending } = useFollow();

	if (suggestedUsers?.length === 0 && leaderboardUsers?.length === 0)
		return <div className='md:w-64 w-0'></div>;

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				{/* Suggested Users Section */}
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{isLoadingUsers && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoadingUsers &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>

				{/* Leaderboard Section */}
				<div className='mt-6'>
					<p className='font-bold'>Leaderboard</p>
					<div className='flex flex-col gap-4'>
						{isLoadingLeaderboard && (
							<>
								<RightPanelSkeleton />
								<RightPanelSkeleton />
								<RightPanelSkeleton />
							</>
						)}
						{!isLoadingLeaderboard &&
							leaderboardUsers?.map((user, index) => (
								<div
									className='flex items-center justify-between p-2 bg-[#1E2226] rounded-md'
									key={user._id}
								>
									<div className='flex gap-2 items-center'>
										<span className='font-bold text-lg'>{index + 1}.</span>
										<div className='avatar'>
											<div className='w-8 rounded-full'>
												<img src={user.profileImg || "/avatar-placeholder.png"} />
											</div>
										</div>
										<div className='flex flex-col'>
											<span className='font-semibold tracking-tight truncate w-28'>
												{user.fullName}
											</span>
											<span className='text-sm text-slate-500'>@{user.username}</span>
										</div>
									</div>
									{/* Display Credit Score here */}
									<span className='font-bold text-green-500'>{user.creditScore}</span>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RightPanel;
