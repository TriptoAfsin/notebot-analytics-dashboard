import { Box } from "@/components/atoms/layout";
import { Title } from "@/components/atoms/typography/title";
import { McpCard } from "@/components/molecules/dashboard/McpCard";
import { DataTable } from "@/components/organisms/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetMcpEmails,
  useGetMcpKeys,
  type McpEmail,
  type McpKey,
} from "@/hooks/networking/analytics/mcp-lists";
import { useDebounced } from "@/hooks/useDebounced";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, KeyRound, Mail, RotateCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const SOURCE_LABEL: Record<string, string> = {
  oauth: "App sign-in",
  dashboard: "Website form",
};

/** "oauth:Claude, dashboard" -> "Claude, Website form" */
const prettySources = (sources: string) =>
  sources
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => (s.startsWith("oauth:") ? s.slice(6) : SOURCE_LABEL[s] ?? s))
    .join(", ");

const dash = (v: string) => v || "-";
const num = (n: number) => n.toLocaleString();

function CopyEmail({ email }: { email: string }) {
  return (
    <Box className="flex items-center gap-1">
      <span className="font-medium">{email}</span>
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 shrink-0"
        aria-label={`Copy ${email}`}
        onClick={() => {
          navigator.clipboard.writeText(email);
          toast.success("Email copied");
        }}
      >
        <Copy className="w-3.5 h-3.5" />
      </Button>
    </Box>
  );
}

const emailColumns: ColumnDef<McpEmail>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <Box className="flex items-center gap-2">
        <CopyEmail email={row.original.email} />
        {row.original.unsubscribed && <Badge variant="outline">unsubscribed</Badge>}
      </Box>
    ),
  },
  {
    accessorKey: "firstSeen",
    header: "Registered",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.firstSeen}</span>
    ),
  },
  {
    accessorKey: "sources",
    header: "Via",
    cell: ({ row }) => prettySources(row.original.sources),
  },
  {
    accessorKey: "keys",
    header: "Keys",
    cell: ({ row }) =>
      `${num(row.original.activeKeys)} active / ${num(row.original.keys)}`,
  },
  {
    accessorKey: "requests",
    header: "Requests",
    cell: ({ row }) => (
      <span className="tabular-nums">{num(row.original.requests)}</span>
    ),
  },
  {
    accessorKey: "lastUsed",
    header: "Last used",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {dash(row.original.lastUsed)}
      </span>
    ),
  },
];

const keyColumns: ColumnDef<McpKey>[] = [
  {
    accessorKey: "email",
    header: "Owner",
    cell: ({ row }) => <CopyEmail email={row.original.email} />,
  },
  {
    accessorKey: "label",
    header: "App",
    cell: ({ row }) =>
      row.original.label ||
      SOURCE_LABEL[row.original.source] ||
      row.original.source,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.createdAt}</span>
    ),
  },
  {
    accessorKey: "lastUsed",
    header: "Last used",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {dash(row.original.lastUsed)}
      </span>
    ),
  },
  {
    accessorKey: "requests",
    header: "Requests",
    cell: ({ row }) => (
      <span className="tabular-nums">{num(row.original.requests)}</span>
    ),
  },
  {
    accessorKey: "revoked",
    header: "Status",
    cell: ({ row }) =>
      row.original.revoked ? (
        <Badge variant="outline">replaced</Badge>
      ) : (
        <Badge>active</Badge>
      ),
  },
];

/** Page, size and search for one table; the DataTable mirrors them in the URL. */
function useTableState() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 500);
  return { page, setPage, pageSize, setPageSize, setSearch, debouncedSearch };
}

function EmailsTable() {
  const t = useTableState();
  const { data, isLoading, isFetching, refetch } = useGetMcpEmails(
    t.page,
    t.pageSize,
    t.debouncedSearch
  );
  return (
    <Box className="space-y-2">
      <Box className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {data ? `${num(data.total)} emails registered for a key` : " "}
        </span>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RotateCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </Box>
      <DataTable
        columns={emailColumns}
        data={data?.emails ?? []}
        showSearch
        showPagination
        showRowsPerPage
        onPageChange={t.setPage}
        onPageSizeChange={t.setPageSize}
        onSearch={t.setSearch}
        totalPages={data?.total_pages}
        currentPage={data?.current_page}
        isLoading={isLoading}
      />
    </Box>
  );
}

function KeysTable() {
  const t = useTableState();
  const { data, isLoading, isFetching, refetch } = useGetMcpKeys(
    t.page,
    t.pageSize,
    t.debouncedSearch
  );
  return (
    <Box className="space-y-2">
      <Box className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {data ? `${num(data.total)} keys issued` : " "}
        </span>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RotateCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </Box>
      <DataTable
        columns={keyColumns}
        data={data?.keys ?? []}
        showSearch
        showPagination
        showRowsPerPage
        onPageChange={t.setPage}
        onPageSizeChange={t.setPageSize}
        onSearch={t.setSearch}
        totalPages={data?.total_pages}
        currentPage={data?.current_page}
        isLoading={isLoading}
      />
    </Box>
  );
}

/**
 * /ai-usage: NoteBot MCP (ai.butexnotebot.com). The summary card on top, then
 * every registered email and every issued key. One table at a time, because
 * the DataTable keeps its page and search in the URL.
 */
export default function AiUsagePage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "keys" ? "keys" : "emails";

  return (
    <Box className="flex flex-col items-center p-4 md:p-6">
      <Box className="w-full max-w-screen-xl space-y-4">
        <Title className="text-2xl font-bold">AI Usage</Title>
        <McpCard showPageLink={false} />

        <Card>
          <CardHeader className="pb-0">
            <Tabs
              value={tab}
              // a fresh tab starts on page 1 with no search
              onValueChange={value => setParams({ tab: value })}
            >
              <TabsList>
                <TabsTrigger value="emails" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Emails
                </TabsTrigger>
                <TabsTrigger value="keys" className="gap-2">
                  <KeyRound className="w-4 h-4" />
                  Keys
                </TabsTrigger>
              </TabsList>
              <CardContent className="px-0 pt-4">
                <TabsContent value="emails">
                  <EmailsTable />
                </TabsContent>
                <TabsContent value="keys">
                  <KeysTable />
                </TabsContent>
              </CardContent>
            </Tabs>
          </CardHeader>
        </Card>
      </Box>
    </Box>
  );
}
