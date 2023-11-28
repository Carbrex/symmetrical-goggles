// component
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
	<SvgColor
		src={`/assets/icons/navbar/${name}.svg`}
		sx={{ width: 1, height: 1 }}
	/>
);

const navConfig = [
	{
		title: "dashboard",
		path: "/dashboard/app",
		icon: icon("ic_analytics"),
	},
	{
		title: "Call Reports",
		path: "/dashboard/user",
		icon: icon("ic_user"),
	},
	{
		title: "Caller",
		path: "/caller",
		icon: icon("ic_user"),
	},
	{
		title: "Coustomer",
		path: "/coustomer",
		icon: icon("ic_user"),
	},
	// {
	//   title: "product",
	//   path: "/dashboard/products",
	//   icon: icon("ic_cart"),
	// },
	// {
	//   title: "blog",
	//   path: "/dashboard/blog",
	//   icon: icon("ic_blog"),
	// },
	{
		title: "login",
		path: "/login",
		icon: icon("ic_lock"),
	},
];

export default navConfig;
