import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { title } from "process"

// Menu items.
const items = [
  {
    title: "Zodiac Weapons (ARR)",
    url: "zodiac",
  },
  {
    title: "Anima Weapons (HW)",
    url: "anima",
  },
  {
    title: "Eureka Weapons (SB)",
    url: "eureka",
  },
  {
    title: "Resistance Weapons (SHB)",
    url: "resistance",
  },
  {
    title: "Manderville Weapons (EW)",
    url: "manderville",
  },
  {
    title: "Phantom Weapons (DT)",
    url: "phantom",
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/">
                        <span>Home</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Relic Weapons</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
